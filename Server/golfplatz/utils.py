from rest_framework.response import Response
from rest_framework import status as response_code


class JsonResponse(Response):
    def __init__(self, data: dict, status: response_code = response_code.HTTP_200_OK):
        if not isinstance(data, dict):
            raise ValueError("Response body must be a dict")
        super().__init__(data, status)
