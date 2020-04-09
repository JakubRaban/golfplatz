from Server.utils import ModelFormCustomValid
from .models import Course


class AddCourseForm(ModelFormCustomValid):
    class Meta:
        model = Course
        fields = '__all__'

    def is_valid(self):
        if not super().is_valid():
            return False
        if bool(len(Course.objects.filter(name=self.cleaned_data['name']))):
            self._errors['error_message'] = 'Ten kurs już istnieje'
            return False
        return True




