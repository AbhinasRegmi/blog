from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from ..utils import DecodeAccessToken
from ..schemas.jwtSchema import JWTEncodingSchema

security = HTTPBearer()

def login_required(credentials: HTTPAuthorizationCredentials = Depends(security)) -> JWTEncodingSchema:
    return DecodeAccessToken(access_token=credentials.credentials)