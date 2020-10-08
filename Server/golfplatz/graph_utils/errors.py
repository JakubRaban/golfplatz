from rest_framework.exceptions import APIException


class GraphError(APIException):
    status_code = 400
    default_detail = 'Graph of adventures contains errors'
