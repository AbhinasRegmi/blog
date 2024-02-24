import httpx
from fastapi import APIRouter
from fastapi.responses import RedirectResponse

from ..exceptions import LoginAgainError
from ..config import settings as get_settings
from ..schemas.userSchema import GoogleResponseUserSchema


authRouter = APIRouter(prefix="/auth")

@authRouter.get("/login", response_class=RedirectResponse)
async def GoogleLogin(successUrl: str):
    formUrl = GetConsentFormUrl(next=successUrl)

    return RedirectResponse(url=formUrl)

@authRouter.get("/login/callback")
async def GoogleCallback(code: str, state: str):
    userData = await GetUserDataWithCode(code)

    return userData











settings = get_settings()




def GetConsentFormUrl(next: str) -> str:
        """
        Next parameter is sucess url after login.
        Success url must accept query param called token to receive auth token.
        """

        #warning: redirect to sucess url must be implemented in callback response from google.

        HEADERS = {"Accept": "application/json"}
        PARAMS = {
            "redirect_uri": settings.GOOGLE_CALLBACK_URL,
            "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
            "access_type": "offline",
            "response_type": "code",
            "prompt": "consent",
            "scope": " ".join([
                settings.GOOGLE_USER_EMAIL_SCOPE_URL,
                settings.GOOGLE_USER_PROFILE_SCOPE_URL
            ]),
            "state": next
        }

        consent_url = httpx.Client().build_request(
            method='GET',
            url=settings.GOOGLE_OAUTH_ROOT_URL,
            headers=HEADERS,
            params=PARAMS
        ).url

        return str(consent_url)

async def GetUserDataWithCode(code: str) -> GoogleResponseUserSchema:
        """
        The code received from google callback is requried here.
        """

        HEADERS = {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        }

        PARAMS = {
            "code": code,
            "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
            "client_secret": settings.GOOGLE_OAUTH_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_CALLBACK_URL,
            "grant_type": "authorization_code"
        }

        try:
              
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url=settings.GOOGLE_OAUTH_TOKEN_URL,
                    headers=HEADERS,
                    params=PARAMS
                )

            response_json = response.json()

            id_token = response_json['id_token']
            access_token = response_json['access_token']

            HEADERS =  HEADERS = {"Accept": "application/json", "Authorization": f"Bearer {id_token}"}

            async with httpx.AsyncClient() as client:
                    response = await client.get(
                        url=settings.GOOGLE_OAUTH_USER_URL + access_token,
                        headers=HEADERS
                    )

            response_json  = response.json()

            return GoogleResponseUserSchema(
                    **response_json
            )
        except Exception as e:
            raise LoginAgainError