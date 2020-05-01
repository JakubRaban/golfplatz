from django.contrib.auth import authenticate
from django.core.exceptions import PermissionDenied
from rest_framework import serializers

from .models import Course, CourseGroup, Participant, PlotPart, Chapter, Adventure, TimerRule, Question, Answer


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


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        exclude = ['question']


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        exclude = ['point_source', 'auto_checked_grade']


class TimerRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimerRule
        exclude = ['adventure']


class AdventureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Adventure
        fields = '__all__'


class CreateAdventuresSerializer(serializers.ModelSerializer):
    internal_id = serializers.IntegerField()
    questions = QuestionSerializer(many=True, read_only=True)
    timer_rules = TimerRuleSerializer(many=True, read_only=True)
    next_adventures = serializers.ListField(
        child=serializers.IntegerField()
    )

    class Meta:
        model = Adventure
        exclude = ['chapter', 'point_source']


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
