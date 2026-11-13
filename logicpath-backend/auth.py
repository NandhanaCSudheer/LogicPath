import os
import re
import secrets
from datetime import datetime, timedelta, timezone
from functools import wraps
import bcrypt
import jwt
from flask import request, jsonify
from pymongo.errors import DuplicateKeyError
from database import users_collection
from config import JWT_SECRET, JWT_EXPIRATION_HOURS

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def generate_token(user_id, email, role="student"):
    """
    Generates a signed JWT for the authenticated user including their role.
    """
    now = datetime.now(timezone.utc)
    payload = {
        "user_id": str(user_id),
        "email": email,
        "role": (role or "student").lower(),
        "iat": now,
        "exp": now + timedelta(hours=JWT_EXPIRATION_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def decode_token(token):
    """
    Decodes and validates a JWT. Returns payload dict or None.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None


def token_required(f):
    """
    Decorator to protect authenticated routes. Attaches current_user to kwargs or context.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"message": "Authentication token is required"}), 401

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"message": "Invalid Authorization header format. Expected 'Bearer <token>'"}), 401

        token = parts[1]
        payload = decode_token(token)
        if not payload:
            return jsonify({"message": "Token is invalid or has expired"}), 401

        user_id = payload.get("user_id")
        current_user = users_collection.find_one({"_id": user_id})
        if not current_user:
            # Also try ObjectId if stored as ObjectId
            try:
                from bson import ObjectId
     
                current_user = users_collection.find_one({"_id": ObjectId(user_id)})
            except Exception:
                pass

        if not current_user:
            return jsonify({"message": "User associated with token not found"}), 401

        # Strip password hash before passing
        user_safe = {
            "id": str(current_user["_id"]),
            "name": current_user.get("name", ""),
            "email": current_user.get("email", ""),
            "role": (current_user.get("role") or payload.get("role") or "student").lower(),
            "xp": int(current_user.get("xp") or 0),
            "level": int(current_user.get("level") or 1),
            "achievements": current_user.get("achievements") or [],
            "problems_completed": int(current_user.get("problems_completed") or 0),
        }
        return f(user_safe, *args, **kwargs)

    return decorated


def roles_allowed(*allowed_roles):
    """
    Decorator to enforce role-based access control.
    Wraps token_required and verifies that current_user has one of the allowed roles.
    """
    def decorator(f):
        @wraps(f)
        def decorated(current_user, *args, **kwargs):
            user_role = (current_user.get("role") or "student").lower()
            normalized_allowed = [r.lower() for r in allowed_roles]
            if user_role not in normalized_allowed:
                return jsonify({
                    "success": False,
                    "message": f"Forbidden: role '{user_role}' is not authorized to access this resource. Required role: {', '.join(allowed_roles)}."
                }), 403
            return f(current_user, *args, **kwargs)
        return token_required(decorated)
    return decorator


def register_user(name, email, password, role="student"):
    """
    Registers a new user with validation, role assignment (student/teacher), bcrypt hashing, and duplicate prevention.
    """
    email = (email or "").strip().lower()
    name = (name or "").strip()
    role = (role or "student").strip().lower()

    if role not in ("student", "teacher"):
        role = "student"

    if not name:
        return {"success": False, "message": "Name is required", "status_code": 400}

    if not email or not EMAIL_REGEX.match(email):
        return {"success": False, "message": "A valid email address is required", "status_code": 400}

    if not password or len(password) < 6:
        return {"success": False, "message": "Password must be at least 6 characters", "status_code": 400}

    # Check for existing user
    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return {"success": False, "message": "A user with this email already exists", "status_code": 409}

    # Hash password
    password_bytes = password.encode("utf-8")
    hashed_password = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")

    now = datetime.now(timezone.utc)
    user_doc = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": role,
        "xp": 0,
        "level": 1,
        "achievements": [],
        "problems_completed": 0,
        "created_at": now,
        "updated_at": now,
    }

    try:
        result = users_collection.insert_one(user_doc)
        user_id = str(result.inserted_id)
        token = generate_token(user_id, email, role=role)

        return {
            "success": True,
            "message": "Account created successfully!",
            "status_code": 201,
            "token": token,
            "user": {
                "id": user_id,
                "name": name,
                "email": email,
                "role": role,
                "xp": 0,
                "level": 1,
                "achievements": [],
                "problems_completed": 0,
            },
        }
    except DuplicateKeyError:
        return {"success": False, "message": "A user with this email already exists", "status_code": 409}
    except Exception as e:
        return {"success": False, "message": f"Database error: {str(e)}", "status_code": 500}


def login_user(email, password):
    """
    Authenticates user and generates a JWT with their role.
    """
    email = (email or "").strip().lower()

    if not email:
        return {"success": False, "message": "Email is required", "status_code": 400}

    if not password:
        return {"success": False, "message": "Password is required", "status_code": 400}

    user = users_collection.find_one({"email": email})
    if not user:
        return {"success": False, "message": "Invalid email or password", "status_code": 401}

    stored_password = user.get("password", "").encode("utf-8")
    entered_password = password.encode("utf-8")

    if not bcrypt.checkpw(entered_password, stored_password):
        return {"success": False, "message": "Invalid email or password", "status_code": 401}

    user_id = str(user["_id"])
    role = (user.get("role") or "student").lower()
    token = generate_token(user_id, email, role=role)

    return {
        "success": True,
        "message": "Login successful!",
        "status_code": 200,
        "token": token,
        "user": {
            "id": user_id,
            "name": user.get("name", ""),
            "email": email,
            "role": role,
            "xp": int(user.get("xp") or 0),
            "level": int(user.get("level") or 1),
            "achievements": user.get("achievements") or [],
            "problems_completed": int(user.get("problems_completed") or 0),
        },
    }


def request_password_reset(email):
    """
    Initiates a password reset token for the user.
    """
    email = (email or "").strip().lower()
    if not email:
        return {"success": False, "message": "Email is required", "status_code": 400}

    user = users_collection.find_one({"email": email})
    if not user:
        # Don't reveal user existence for security, or return neutral success
        return {
            "success": True,
            "message": "If an account with that email exists, reset instructions have been created.",
            "status_code": 200,
        }

    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)

    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"reset_token": reset_token, "reset_token_expires": expires_at}}
    )

    # For development environments without SMTP server:
    return {
        "success": True,
        "message": "Password reset token generated successfully. Valid for 1 hour.",
        "reset_token": reset_token,
        "status_code": 200,
    }


def reset_password_with_token(reset_token, new_password):
    """
    Resets user password given a valid unexpired reset token.
    """
    if not reset_token:
        return {"success": False, "message": "Reset token is required", "status_code": 400}

    if not new_password or len(new_password) < 6:
        return {"success": False, "message": "New password must be at least 6 characters", "status_code": 400}

    now = datetime.now(timezone.utc)
    user = users_collection.find_one({
        "reset_token": reset_token,
        "reset_token_expires": {"$gt": now}
    })

    if not user:
        return {"success": False, "message": "Invalid or expired reset token", "status_code": 400}

    hashed_password = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    users_collection.update_one(
        {"_id": user["_id"]},
        {
            "$set": {
                "password": hashed_password,
                "updated_at": now
            },
            "$unset": {
                "reset_token": "",
                "reset_token_expires": ""
            }
        }
    )

    return {"success": True, "message": "Password has been successfully reset. You can now log in.", "status_code": 200}