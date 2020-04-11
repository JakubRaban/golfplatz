
from .utils import ModelFormCustomValid
from .models import Course
from django import forms

from .utils import ModelFormCustomValid
from .models import Course, Participant


class RegisterStudentForm(ModelFormCustomValid):
    password_confirm = forms.CharField(max_length=255)

    class Meta:
        model = Participant
        fields = ['email', 'password', 'password_confirm', 'first_name', 'last_name', 'student_number', 'phone_number']

    def is_valid(self):
        if not super().is_valid():
            return False
        if Participant.objects.filter(email=self.cleaned_data['email']):
            self._errors['error_message'] = 'Ten email jest już w użyciu'

        if self.cleaned_data['password_confirm'] != self.cleaned_data['password']:
            self._errors['confirm_password'] = 'Podane hasła są różne'

        if len(self._errors) > 0:
            return False

        return True


class RegisterTutorForm(ModelFormCustomValid):
    password_confirm = forms.CharField(max_length=255)

    class Meta:
        model = Participant
        fields = ['email', 'password', 'password_confirm', 'first_name', 'last_name']

    def is_valid(self):
        if not super().is_valid():
            return False
        if Participant.objects.filter(email=self.cleaned_data['email']):
            self._errors['error_message'] = 'Ten email jest już w użyciu'

        if self.cleaned_data['password_confirm'] != self.cleaned_data['password']:
            self._errors['confirm_password'] = 'Podane hasła są różne'

        if len(self._errors) > 0:
            return False

        return True
