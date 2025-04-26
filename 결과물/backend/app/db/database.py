import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# database core/: This file is responsible for managing the database engine and session.

# Get the base directory of the project
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Define the SQLite database URL (database file will be stored in the project's root directory)
SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'sql_app.db')}"

# Print the database URL for debugging purposes
print(SQLALCHEMY_DATABASE_URL)

# Create the SQLAlchemy database engine
# "connect_args={"check_same_thread": False}" is needed to allow multiple threads to access the database.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a session factory to interact with the database
# - autocommit=False: Prevents automatic commits, so changes must be committed manually.
# - autoflush=False: Prevents automatic flushing of changes to the database.
# - bind=engine: Links the session to the SQLite database engine.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a base class for database models
# All database models should inherit from this class.
Base = declarative_base()

# Function to get a database session
# - Each request gets a new session.
# - The session is closed automatically after the request is finished.
def get_db():
    print("get_db session check")  # Debugging message to check when the function is called.
    db = SessionLocal()  # Create a new database session.
    try:
        yield db  # Provide the session to the request handler.
    finally:
        db.close()  # Ensure the session is closed after the request is completed.
