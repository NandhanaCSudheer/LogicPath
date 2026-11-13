import os
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI is not set in the .env file")

JWT_SECRET = os.getenv("JWT_SECRET", "logicpath_secret_jwt_key_2026")
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))
PORT = int(os.getenv("PORT", "5000"))
DEBUG = os.getenv("DEBUG", "True").lower() == "true"