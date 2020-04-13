from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import Course, Participant


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'

    def create(self, validated_data):
        return Participant.objects.create_user(email=validated_data['email'], password=validated_data['password'],
                                               first_name=validated_data['first_name'],
                                               last_name=validated_data['last_name'],
                                               phone_number=validated_data['phone_number'],
                                               student_number=validated_data['student_number'])

    def update(self, *args, **kwargs):
        user = super().update(*args, **kwargs)
        p = user.password
        user.set_password(p)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect credentials")
