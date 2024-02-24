from typing import Optional
from datetime import datetime

from pydantic import BaseModel, EmailStr

class JWTEncodingSchema(BaseModel):
    sub: EmailStr
    exp: Optional[datetime] = None