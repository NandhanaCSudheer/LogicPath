import os
import sys
from pymongo import MongoClient, ASCENDING
from config import MONGO_URI

db = None
users_collection = None
circuits_collection = None
simulation_history_collection = None
questions_collection = None
submissions_collection = None
discussions_collection = None
learning_progress_collection = None
is_connected_to_configured_uri = False

def get_database():
    global db, users_collection, circuits_collection, simulation_history_collection
    global questions_collection, submissions_collection, discussions_collection
    global learning_progress_collection, is_connected_to_configured_uri
    if db is not None:
        return db

    # 1. Attempt connection using configured MONGO_URI from .env
    try:
        client = MongoClient(
            MONGO_URI,
            serverSelectionTimeoutMS=3000,
            connectTimeoutMS=3000,
            socketTimeoutMS=3000
        )
        client.admin.command('ping')
        db = client["logicpath"]
        is_connected_to_configured_uri = True
        print("[DATABASE] Connected to configured MongoDB successfully.")
    except Exception as e:
        print("[DATABASE WARNING] Failed to connect to configured MONGO_URI (remote Atlas DNS/network error).")
        print("[DATABASE NOTICE] Checking for local MongoDB service fallback (mongodb://127.0.0.1:27017)...")
        try:
            fallback_client = MongoClient(
                "mongodb://127.0.0.1:27017",
                serverSelectionTimeoutMS=2000,
                connectTimeoutMS=2000
            )
            fallback_client.admin.command('ping')
            db = fallback_client["logicpath"]
            print("[DATABASE] Successfully connected to local MongoDB fallback.")
        except Exception as local_err:
            print("[DATABASE WARNING] Local MongoDB also unavailable. Initializing resilient in-memory storage fallback.")
            from mock_database import MockDatabase
            db = MockDatabase()

    users_collection = db["users"]
    circuits_collection = db["circuits"]
    simulation_history_collection = db["simulation_history"]
    questions_collection = db["questions"]
    submissions_collection = db["student_submissions"]
    discussions_collection = db["question_discussions"]
    learning_progress_collection = db["learning_progress"]

    # Ensure indexes
    try:
        users_collection.create_index([("email", ASCENDING)], unique=True)
        circuits_collection.create_index([("user_id", ASCENDING)])
        simulation_history_collection.create_index([("user_id", ASCENDING), ("circuit_id", ASCENDING)])
        questions_collection.create_index([("teacher_id", ASCENDING), ("status", ASCENDING)])
        questions_collection.create_index([("status", ASCENDING)])
        submissions_collection.create_index([("student_id", ASCENDING), ("question_id", ASCENDING)])
        discussions_collection.create_index([("question_id", ASCENDING), ("created_at", ASCENDING)])
        learning_progress_collection.create_index([("student_id", ASCENDING)], unique=True)
    except Exception as idx_err:
        print(f"[DATABASE] Index creation notice: {idx_err}")



    return db

# Initialize on import
get_database()