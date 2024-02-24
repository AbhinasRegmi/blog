from fastapi import HTTPException, status

class TokenInvalidError(HTTPException):
    def __init__(self) -> None:
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token Invalid Error")