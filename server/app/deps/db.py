from typing import Generator
from ..config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

engine = create_engine(settings().MYSQL_DB_URI)


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session