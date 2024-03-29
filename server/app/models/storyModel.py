import json
from typing import Optional
from xmlrpc.client import boolean
from pydantic import BaseModel as PydanticBase, Field
from sqlalchemy import ForeignKey, String, Text, false
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql import func, desc
from sqlalchemy.orm import mapped_column, Mapped, Session, relationship

from uuid import uuid4
from datetime import datetime, date


from .base import BaseModel
from .userModel import Users
from ..exceptions import StoryNotFoundError, UserNotFoundError



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
    created_at: datetime
    updated_at: datetime


class StoryTitleResponse(PydanticBase):
    key: str
    title: str
    isPublished: boolean
    author: str
    updatedAt: str
    summary: Optional[str] = None
    authorImageUrl: Optional[str] = None

class Story(BaseModel):
    __tablename__ = 'stories'

    storyID: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    isPublished: Mapped[boolean]
    summary: Mapped[Optional[str]] = mapped_column(Text)
    content: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())

    userEmail: Mapped[str] = mapped_column(String(255), ForeignKey('users.email'))
    user: Mapped[Users] = relationship(back_populates='stories')


    @staticmethod
    def createNewStory(db: Session, email: str) -> 'Story':
        try:
            if(Users.GetUserByEmail(email, db)):
                db.expire_on_commit = False

                if(story:=Story.getLatestEmptyStory(db, email)):
                    return story
                
                story_db = Story(
                    userEmail = email,
                    content = '',
                    isPublished = False
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
    def deleteStory(db: Session, email: str, storyID: str) -> None:
        db.query(Story).filter(Story.storyID == storyID).filter(Story.userEmail==email).delete(synchronize_session=False)
        db.commit()

    @staticmethod
    def updateStory(db: Session, email: str, story: StoryUpdateSchema) -> None:
        try:
            db.query(Story).filter(Story.userEmail==email).filter(Story.storyID == story.storyID).update({Story.content: story.content}, synchronize_session=False)
            db.commit()
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def updateStatus(db: Session, email: str, isPublished: bool, storyID: str) -> None:
        try:
            db.query(Story).filter(Story.userEmail == email).filter(Story.storyID==storyID).update({Story.isPublished: isPublished}, synchronize_session=False)
            db.commit()
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def getStoryWithID(db: Session, storyID: str, email: str) -> 'Story':
        res = db.query(Story).filter(Story.storyID==storyID).filter(Story.userEmail==email).first()

        if not res:
            raise StoryNotFoundError
        
        return res
    
    @staticmethod
    def getPublicStoryWithID(db: Session, storyID: str) -> 'Story':
        res = db.query(Story).filter(Story.storyID==storyID).filter(Story.isPublished==True).first()

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

    @staticmethod
    def getLatestEmptyStory(db: Session, email: str) -> Optional['Story']:
        return db.query(Story).filter((Story.content == '') | (Story.content == '[]')).filter(Story.userEmail==email).order_by(desc(Story.created_at)).first()
    
    @staticmethod
    def updateStorySummary(db: Session, email: str, summary: str, storyID: str) -> None:
        db.query(Story).filter(Story.storyID==storyID).filter(Story.userEmail==email).update({Story.summary: summary}, synchronize_session=False)
        db.commit()

    @staticmethod
    def getStoryTitles(db: Session, email: Optional[str] = None, isPublished: Optional[boolean] = None, offset: int = 0, limit: int = 10):
        query = db.query(Story)

        if email:
            query = query.filter(Story.userEmail == email)
        if isPublished:
            query = query.filter(Story.isPublished == isPublished)

        res = list(query.order_by(desc(Story.updated_at)).limit(limit).offset(offset))

        json_result = []
        for s in res:
            try:
                content = json.loads(s.content) #type:ignore
                if(len(content) > 0):
                    content = content[0]['value']
                else:
                    content = 'Untitled Story'
            except json.JSONDecodeError:
                content = 'Untitled Story'

            json_result.append({
                'key': s.storyID,
                'title': content,
                'isPublished': s.isPublished,
                'author': s.user.firstName + ' ' + s.user.lastName,
                'updatedAt': s.updated_at.strftime("%b %d, %Y"),
                'summary': s.summary,
                'authorImageUrl': s.user.imageUrl,
            })

        return json_result

