from typing import Optional
from xmlrpc.client import boolean
from pydantic import BaseModel as PydanticBase, Field
from sqlalchemy import ForeignKey, String, Text, false
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql import func
from sqlalchemy.orm import mapped_column, Mapped, Session, relationship

from uuid import uuid4
from datetime import datetime


from .base import BaseModel
from .userModel import Users
from ..exceptions import StoryNotFoundError, UserNotFoundError


class StoryCreateSchema(PydanticBase):
    content: str | None = None

class StoryUpdateSchema(PydanticBase):
    storyID: str
    content: str | None = None

class StoryStatusUpdateSchema(PydanticBase):
    storyID: str
    isPublished: boolean

class StoryResponseSchema(PydanticBase):
    storyID: str
    content: str | None = None
    userEmail: str
    created_at: str
    updated_at: str

class StoryContentSchema(PydanticBase):
    type: str
    key: str
    value: str

class Story(BaseModel):
    __tablename__ = 'stories'

    storyID: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    isPublished: Mapped[boolean] = mapped_column(default=false)
    content: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())

    userEmail: Mapped[str] = mapped_column(String(255), ForeignKey('users.email'))
    user: Mapped[Users] = relationship(viewonly=True)


    @staticmethod
    def createNewStory(db: Session, email: str, story: StoryCreateSchema) -> 'Story':
        try:
            if(Users.GetUserByEmail(email, db)):
                db.expire_on_commit = False
                story_db = Story(
                    userEmail = email,
                    content = story.content,
                )

                db.add(story_db)
                db.commit()

                return story_db
            raise UserNotFoundError
        except UserNotFoundError:
            raise
        except Exception:
            db.rollback()
            raise
            
    @staticmethod
    def updateStory(db: Session, email: str, story: StoryUpdateSchema) -> None:
        try:
            db.query(Story).filter(Story.userEmail==email).filter(Story.storyID == story.storyID).update({Story.content: story.content}, synchronize_session=False)
            db.commit()
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def updateStatus(db: Session, email: str, status: StoryStatusUpdateSchema) -> None:
        try:
            db.query(Story).filter(Story.userEmail == email).filter(Story.storyID==status.storyID).update({Story.isPublished: status.isPublished}, synchronize_session=False)
            db.commit()
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def getStoryWithID(db: Session, storyID: str) -> 'Story':
        res = db.query(Story).filter(Story.storyID==storyID).first()

        if not res:
            raise StoryNotFoundError
        
        return res

    @staticmethod
    def getStoriesOfUser(db: Session, email: str, isPublished: boolean | None = None, offset: int = 0, limit: int = 10) -> list['Story']:
        if(isPublished):
            return list(db.query(Story).filter(Story.userEmail==email).filter(Story.isPublished==isPublished).limit(limit).offset(offset))
        
        return list(db.query(Story).filter(Story.userEmail==email).limit(limit).offset(offset))
    
    @staticmethod
    def getAllPublishedStories(db: Session, offset: int = 0, limit: int = 10) -> list['Story']:
        return list(db.query(Story).filter(Story.isPublished==True).limit(limit).offset(offset))