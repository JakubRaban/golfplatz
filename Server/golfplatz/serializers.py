from django.contrib.auth import authenticate
from django.core.exceptions import PermissionDenied
from rest_framework import serializers

from .models import Course, CourseGroup, Participant


class CourseSerializer(serializers.ModelSerializer):
    course_groups = serializers.StringRelatedField(many=True)

    class Meta:
        model = Course
        fields = '__all__'


class CourseGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseGroup
        fields = '__all__'


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'

    def create(self, validated_data):
        return Participant.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user and user.is_active:
            return user
        raise PermissionDenied()
