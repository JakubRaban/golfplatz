from django.contrib.auth import authenticate
from django.core.exceptions import PermissionDenied
from rest_framework import serializers

from .models import Course, CourseGroup, Participant, PlotPart, Chapter, Adventure, TimerRule, \
    Question, Answer, PointSource, SurpriseExercise, Path


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
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Question
        exclude = ['point_source', 'grades']


class SurpriseExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurpriseExercise
        exclude = ['point_source']


class PointSourceSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)
    surprise_exercise = SurpriseExerciseSerializer(allow_null=True, required=False)

    class Meta:
        model = PointSource
        exclude = ['adventure']

    def points_validation(self, value):
        try:
            value = float(value)
        except ValueError:
            raise serializers.ValidationError("This field should be a number or a string representing a number")
        return value

    def validate_points_per_correct_answer(self, value):
        return self.points_validation(value)

    def validate_points_per_incorrect_answer(self, value):
        return self.points_validation(value)


class TimerRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimerRule
        exclude = ['adventure']


class PathSerializer(serializers.ModelSerializer):
    class Meta:
        model = Path
        exclude = ['students']


class AdventureSerializer(serializers.ModelSerializer):
    point_source = PointSourceSerializer()

    class Meta:
        model = Adventure
        fields = '__all__'


class CreateAdventuresSerializer(serializers.ModelSerializer):
    internal_id = serializers.IntegerField()
    point_source = PointSourceSerializer()
    timer_rules = TimerRuleSerializer(many=True, allow_null=True)
    next_adventures = serializers.ListField(
        child=serializers.IntegerField(), allow_empty=True, allow_null=True
    )

    class Meta:
        model = Adventure
        exclude = ['chapter']


class ChapterSerializer(serializers.ModelSerializer):
    adventures = AdventureSerializer(many=True)

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
