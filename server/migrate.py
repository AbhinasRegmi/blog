from app.models.base import BaseModel
from app.models.userModel import Users
from app.models.storyModel import Story
from app.deps.db import engine

def migrate():
    BaseModel.metadata.create_all(engine)

def clean():
    BaseModel.metadata.drop_all(engine)