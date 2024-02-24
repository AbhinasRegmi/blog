from pydantic import BaseModel, EmailStr, Field

class GoogleResponseUserSchema(BaseModel):
    email: EmailStr
    firstName: str | None = Field(default=None, alias='given_name')
    lastName: str | None = Field(default=None, alias='family_name')
    imageUrl: str | None = Field(default=None, alias='picture')