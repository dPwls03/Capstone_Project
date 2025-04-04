# ✅ 3주차: 백엔드 구축

## FastAPI 환경설정

> 🔗 참고 자료  
- [FastAPI](https://fastapi.tiangolo.com/ko/)

> 가상환경에서 FastAPI 설치 밒 코드 편집기 실행

```bash
pip install "fastapi[standard]"
```

> backend 폴더에서 app 폴더 생성 및 `main.py` 파일 생성

```
- 코드 편집기 확장 프로그램 'Black Formatter' 설치
```

`main.py`

```bash
from typing import Union

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

```

> 개발용 서버 실행하기

```bash
fastapi dev app/main.py
```

## SQLite 설정 및 연동

> 🔗 참고 자료  
- [SQLAlchemy](https://docs.sqlalchemy.org/en/20/intro.html#installation)

FastApi에서는 sqlalchemy라는 도구를 사용해서 데이터 베이스와 연결하고, 데이터를 관리할 수 있다.

> 가상환경에서 SQLAlchemy 설치
```bash
pip install SQLAlchemy
```

> `database.py` 파일 만들기

```bash
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
```

> model 정의(테이블의 구조 정의)

```
- models라는 폴더 생성
- user, session, detection_log 테이블 정의
```

user 정보 담는 `user.py`

```bash
import random
import string
from sqlalchemy import Boolean, Column, DateTime, Integer, String, func
from sqlalchemy.orm import relationship
import pytz
from datetime import datetime
from app.db.database import Base

# user models/: 데이터베이스 모델을 정의합니다.

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True) # 사용자 이름
    password = Column(String) # 비밀번호
    count_login = Column(Integer, default=0) # 로그인 횟수
    validation_number = Column(String, default=lambda: ''.join(random.choices(string.digits, k=6))) # 이메일 인증 번호 랜덤한 6자리 기본값
    verified = Column(Boolean, default=False) # 이메일 인증 여부
    role = Column(String) # 권한
    plan = Column(String) # 플랜
    created_at = Column(DateTime(timezone=True), 
                       default=lambda: datetime.now(pytz.timezone('Asia/Seoul')))
    expired_at = Column(DateTime(timezone=True)) # 서비스 만료일

    # DetectionLog와의 관계 설정
    # detection_logs = relationship("DetectionLog", back_populates="user")
```

세션 정보 담는 `session.py`

```bash
from sqlalchemy import Column, Integer, DateTime, JSON, String
from sqlalchemy.sql import func
import pytz
from datetime import datetime
from app.db.database import Base

# session models/: 데이터베이스 모델을 정의합니다.

class Session(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, index=True)
    data = Column(JSON)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(pytz.timezone("Asia/Seoul")),
    )
    last_accessed_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(pytz.timezone("Asia/Seoul")),
        onupdate=lambda: datetime.now(pytz.timezone("Asia/Seoul")),
    )
    expires_at = Column(DateTime(timezone=True))
```

화재 감지된 데이터를 담는 `detection_log.py`

```bash
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    String,
    JSON,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from app.db.database import Base
import pytz
from datetime import datetime

# logs models/: 데이터베이스 모델을 정의합니다.
class DetectionLog(Base):
    __tablename__ = "detection_logs"

    id = Column(Integer, primary_key=True, index=True)
    # user_id = Column(
    #     Integer, ForeignKey("users.id"), nullable=False
    # )  # User 모델과의 관계 설정
    file_name = Column(String)  # 원본 이미지 파일명
    result_image = Column(String)  # 처리된 결과 이미지 경로
    detections = Column(JSON)  # 감지된 객체들의 정보 (class_name, confidence, bbox 등)
    message = Column(String)  # 처리 결과 메시지
    has_fire = Column(Boolean, default=False)  # 화재 감지 여부
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(pytz.timezone("Asia/Seoul")),
    )

    # User 모델과의 관계 설정
    # user = relationship("User", back_populates="detection_logs")
```

> `main.py` 파일에서 정의된 데이터베이스 초기화

`main.py`

```bash
from typing import Union
from fastapi import FastAPI

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.database import engine, Base
from app.db.models import (
    user as user_model,
    session as session_model,
    detection_log as detection_log_model,
)

def init_db():
    Base.metadata.create_all(bind=engine)

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
```

> sql_app.db 생성

```
`main.py` 설정 후 재시작
확장프로그램 'SQLite' 설치
command palette에서 SQLite 메뉴 중 opend database 선택
sql_app.db 파일 선택
```