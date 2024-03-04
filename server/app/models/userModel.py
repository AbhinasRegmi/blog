from typing import Optional
from sqlalchemy import String, Text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import mapped_column, Mapped, Session, relationship


from .base import BaseModel
from ..exceptions import UserAlreadyExistsError
from ..schemas.userSchema import GoogleResponseUserSchema

class Users(BaseModel):
    __tablename__ = 'users'

    email: Mapped[str] = mapped_column(String(255), primary_key=True)
    firstName: Mapped[str] = mapped_column(String(255))
    lastName: Mapped[str] = mapped_column(String(255))
    imageUrl: Mapped[str] = mapped_column(Text())

    stories: Mapped[list['Story']] = relationship(back_populates='user') #type:ignore

    @staticmethod
    def GetUserByEmail(email: str, db: Session) -> Optional['Users']:
        return db.query(Users).filter(Users.email == email).first()
    
    @staticmethod
    def AddNewUser(user: GoogleResponseUserSchema, db: Session) -> 'Users':
        try:
            user_db = Users(**user.model_dump())
            db.autoflush = False
            db.add(user_db)
            db.commit()
            return user_db
        except IntegrityError:
            raise UserAlreadyExistsError
        

def AddNewUserInBackGround(user: GoogleResponseUserSchema, db: Session):
    try:
        Users.AddNewUser(user, db)
    except UserAlreadyExistsError:
        print("New User Added. Now send email.")