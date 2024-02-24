from .base import BaseModel
from .userModel import Users
from ..deps.db import engine

def migrate():
    BaseModel.metadata.create_all(engine)

def clean():
    BaseModel.metadata.drop_all(engine)