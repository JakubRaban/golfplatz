from django.contrib.auth import authenticate
from django.core.exceptions import PermissionDenied
from rest_framework import serializers

from .models import Course, CourseGroup, Participant, PlotPart, Chapter, Adventure


class CreateCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name', 'description']


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


class AdventureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adventure
        fields = '__all__'


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = '__all__'


class CreateChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['name', 'description']


class PlotPartSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)

    class Meta:
        model = PlotPart
        fields = '__all__'


class CreatePlotPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlotPart
        fields = ['name', 'introduction']


class CourseSerializer(serializers.ModelSerializer):
    course_groups = serializers.StringRelatedField(many=True)
    plot_parts = PlotPartSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'
