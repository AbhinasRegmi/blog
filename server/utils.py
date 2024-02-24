from datetime import datetime, timedelta

from jose import jwt, JWTError

from .config import settings
from .exceptions import TokenInvalidError
from .schemas.jwtSchema import JWTEncodingSchema


def EncodeAccessToken(data: JWTEncodingSchema) -> str:
    config = settings()

    data.exp = datetime.utcnow() + timedelta(minutes=config.JWT_ACCESS_TOKEN_EXP)
    to_encode = data.model_dump()

    encoded_jwt = jwt.encode(
        to_encode,
        config.JWT_ACCESS_SECRET_KEY,
        algorithm=config.JWT_ALGORITHM
    )

    return encoded_jwt

def DecodeAccessToken(access_token: str) -> JWTEncodingSchema:
    config = settings()

    try:
        payload = jwt.decode(
            access_token,
            config.JWT_ACCESS_SECRET_KEY,
            algorithms=[config.JWT_ALGORITHM]
        )

        return JWTEncodingSchema(**payload)
    
    except JWTError as err:
        raise TokenInvalidError