from django.forms import ModelForm
from rest_framework.response import Response
from rest_framework import status


class JsonResponse:
    def __init__(self, data: dict, response_code: status = status.HTTP_200_OK):
        self.data = data
        self.response_code = response_code

    def get_response(self):
        return Response(self.data, status=self.response_code)


class ModelFormCustomValid(ModelForm):
    @property
    def errors(self):
        errors = {}
        errors.update(super().errors)
        errors.update(self._errors)
        return errors
