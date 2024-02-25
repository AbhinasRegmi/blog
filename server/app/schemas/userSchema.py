from pydantic import BaseModel, EmailStr, Field

class GoogleResponseUserSchema(BaseModel):
    email: EmailStr
    firstName: str = Field(..., alias='given_name')
    lastName: str = Field(..., alias='family_name')
    imageUrl: str = Field(..., alias='picture')

class UserResponseSchema(BaseModel):
    email: EmailStr
    firstName: str
    lastName: str
    imageUrl: str