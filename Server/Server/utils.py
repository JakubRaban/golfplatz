from django.forms import ModelForm
from rest_framework.response import Response


class JsonResponse:
    status = True
    data = {}

    def __init__(self, data=None, status=True):
        self.data = data
        self.status = status

    def parse(self):
        return Response({"status": self.status, "data": self.data})

    @staticmethod
    def not_found_error():
        return Response({"status": False, "data": {'error_message': 'Not found.'}})


class ModelFormCustomValid(ModelForm):
    @property
    def errors(self):
        errors = {}
        errors.update(super().errors)
        errors.update(self._errors)
        return errors
