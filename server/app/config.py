from functools import lru_cache
from pydantic_settings import BaseSettings

class BSettings(BaseSettings):
    model_config = {
        'env_file': '.env',
        'case_sensitive': True
    }

    MYSQL_DB_URI: str
    JWT_ACCESS_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXP: int = 7 * 24 * 60 #7 Days

    GOOGLE_OAUTH_CLIENT_ID: str
    GOOGLE_OAUTH_CLIENT_SECRET: str
    GOOGLE_CALLBACK_URL: str = "http://localhost:8000/auth/login/callback"
    GOOGLE_OAUTH_TOKEN_URL: str = "https://oauth2.googleapis.com/token"
    GOOGLE_OAUTH_ROOT_URL: str = "https://accounts.google.com/o/oauth2/v2/auth"
    GOOGLE_USER_EMAIL_SCOPE_URL: str = "https://www.googleapis.com/auth/userinfo.email"
    GOOGLE_USER_PROFILE_SCOPE_URL: str = "https://www.googleapis.com/auth/userinfo.profile"
    GOOGLE_OAUTH_USER_URL: str = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token="



@lru_cache(maxsize=1)
def settings() -> BSettings:
    return BSettings() #type:ignore