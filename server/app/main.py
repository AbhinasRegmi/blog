from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.userRouter import userRouter

from .routes.authRouter import authRouter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
    allow_credentials=True
)

app.include_router(authRouter, tags=['auth'])
app.include_router(userRouter, tags=['user'])

