from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from ..utils import DecodeAccessToken
from ..schemas.jwtSchema import JWTEncodingSchema

security = HTTPBearer()

def LoginRequired(credentials: HTTPAuthorizationCredentials = Depends(security)) -> JWTEncodingSchema:
    return DecodeAccessToken(access_token=credentials.credentials)

def GetUserEmail(userData: JWTEncodingSchema = Depends(LoginRequired)) -> str:
    return userData.sub