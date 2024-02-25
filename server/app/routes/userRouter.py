from fastapi import APIRouter, Depends

from ..deps.db import get_db
from ..deps.auth import GetUserEmail
from ..models.userModel import Users
from ..exceptions import SomethingWentWrongError
from ..schemas.userSchema import UserResponseSchema


userRouter = APIRouter(prefix="/user")


@userRouter.get("/info", response_model=UserResponseSchema)
def getUserInfo(email: str = Depends(GetUserEmail), db = Depends(get_db)):
    user = Users.GetUserByEmail(email, db)

    if not user:
        raise SomethingWentWrongError
    
    return user