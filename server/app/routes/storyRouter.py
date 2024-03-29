
from fastapi import APIRouter, BackgroundTasks, Body, Depends, status

from ..deps.db import get_db
from ..deps.auth import GetUserEmail
from ..models.storyModel import Story, StoryResponseSchema, StoryUpdateSchema, StoryTitleResponse

#TODO: Create Title and Send Only Title when sending list. Optimization 

storyRouter = APIRouter(prefix="/story")

@storyRouter.get("/", status_code=status.HTTP_200_OK, response_model=StoryResponseSchema)
def getStoryByID(storyID: str, db=Depends(get_db), email = Depends(GetUserEmail)):
    return Story.getStoryWithID(db, storyID, email)

@storyRouter.get("/public", status_code=status.HTTP_200_OK, response_model=StoryResponseSchema)
def getPublicStoryByID(storyID: str, db=Depends(get_db)):
    return Story.getPublicStoryWithID(db, storyID)

@storyRouter.get("/all", status_code=status.HTTP_200_OK, response_model=list[StoryTitleResponse])
def getAllStories(db = Depends(get_db), limit: int = 10, offset: int = 0):
    return Story.getStoryTitles(db, isPublished=True, limit=limit, offset=offset)

@storyRouter.get("/new", status_code=status.HTTP_201_CREATED, response_model=StoryResponseSchema)
def newStory(db = Depends(get_db), email = Depends(GetUserEmail)):
    return Story.createNewStory(db, email)

@storyRouter.post("/update", status_code=status.HTTP_202_ACCEPTED)
def updateStory(story: StoryUpdateSchema, db = Depends(get_db), email = Depends(GetUserEmail)):
    Story.updateStory(db, email, story)

    return {
        "msg": "OK"
    }

@storyRouter.post("/optim-update", status_code=status.HTTP_202_ACCEPTED)
def optimUpdateStory(bg: BackgroundTasks, story: StoryUpdateSchema, db = Depends(get_db), email = Depends(GetUserEmail)):
    bg.add_task(Story.updateStory, db, email, story)

    return {
        "msg": "OK"
    }

@storyRouter.get("/update/status", status_code=status.HTTP_200_OK)
def updateStoryStatus(storyID: str, isPublished: bool, db=Depends(get_db), email=Depends(GetUserEmail)):
    Story.updateStatus(db, email, isPublished, storyID)

    return {
        "msg": "OK"
    }

@storyRouter.post("/update/summary", status_code=status.HTTP_200_OK)
def updateStorySummary(storyID: str, summary: str = Body(...), db=Depends(get_db), email=Depends(GetUserEmail)):
    Story.updateStorySummary(db, email, summary, storyID)
    return {
        "msg": "OK"
    }

@storyRouter.delete("/delete", status_code=status.HTTP_200_OK)
def deleteStory(storyID: str, db=Depends(get_db), email=Depends(GetUserEmail)):
    Story.deleteStory(db, email, storyID)

    return {
        "msg": "OK"
    }

@storyRouter.get("/all/mine", status_code=status.HTTP_200_OK, response_model=list[StoryTitleResponse])
def getMineStories(db = Depends(get_db), email = Depends(GetUserEmail), isPublished: bool | None = None, offset: int = 0, limit: int = 10):
    return Story.getStoryTitles(db, email, isPublished, offset, limit)