from .utils import ModelFormCustomValid
from .models import Course


class AddCourseForm(ModelFormCustomValid):
    class Meta:
        model = Course
        fields = '__all__'

    def is_valid(self):
        if not super().is_valid():
            return False
        if Course.objects.filter(course_name=self.cleaned_data['course_name']):
            self._errors['error_message'] = 'Ten kurs już istnieje'
            return False
        return True
