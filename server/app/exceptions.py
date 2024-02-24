from fastapi import HTTPException, status

class TokenInvalidError(HTTPException):
    def __init__(self) -> None:
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token Invalid Error")

class LoginAgainError(HTTPException):
    def __init__(self) -> None:
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail='Try to Login Again')

class UserAlreadyExistsError(HTTPException):
    def __init__(self) -> None:
        super().__init__(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="User already exists.")

class SomethingWentWrongError(HTTPException):
    def __init__(self) -> None:
        super().__init__(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Something went wrong")