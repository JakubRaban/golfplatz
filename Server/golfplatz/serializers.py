from django.contrib.auth import authenticate
from django.core.exceptions import PermissionDenied
from rest_framework import serializers

from .models import Course, CourseGroup, Participant, PlotPart, Chapter, Adventure, TimerRule, \
    Question, Answer, PointSource, SurpriseExercise, Path


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user and user.is_active:
            return user
        raise PermissionDenied()


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'

    def create(self, validated_data):
        return Participant.objects.create_user(**validated_data)


class CreateCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name', 'description']


class CourseGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseGroup
        fields = '__all__'


class PathChoiceSerializer(serializers.Serializer):
    to_adventure = serializers.PrimaryKeyRelatedField(queryset=Adventure.objects.all())
    path_description = serializers.CharField()


class NextAdventureChoiceSerializer(serializers.Serializer):
    from_adventure = serializers.PrimaryKeyRelatedField(queryset=Adventure.objects.all())
    choice_description = serializers.CharField()
    path_choices = PathChoiceSerializer(many=True)


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
        fields = '__all__'


class AdventureSerializer(serializers.ModelSerializer):
    point_source = PointSourceSerializer()
    timer_rules = TimerRuleSerializer(many=True)

    class Meta:
        model = Adventure
        exclude = ['done_by_students']


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
        fields = ['name', 'description', 'points_for_max_grade']


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


class ClosedQuestionAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    marked_answers = serializers.ListField(child=serializers.IntegerField(), allow_empty=True)


class OpenQuestionAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    given_answer = serializers.CharField()


class AdventureAnswerSerializer(serializers.Serializer):
    start_time = serializers.DateTimeField()
    answer_time = serializers.IntegerField()
    closed_questions = ClosedQuestionAnswerSerializer(many=True, allow_empty=True)
    open_questions = OpenQuestionAnswerSerializer(many=True, allow_empty=True)


class QuestionSummarySerializer(serializers.Serializer):
    text = serializers.CharField()
    is_auto_checked = serializers.BooleanField()
    points_scored = serializers.DecimalField(max_digits=6, decimal_places=3)
    max_points = serializers.DecimalField(max_digits=6, decimal_places=3)


class AdventureSummarySerializer(serializers.Serializer):
    adventure_name = serializers.CharField()
    answer_time = serializers.IntegerField()
    time_modifier = serializers.IntegerField()
    question_summaries = QuestionSummarySerializer(many=True)
