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

    def validate(self, attrs):
        if attrs['is_auto_checked']:
            answers = attrs.get('answers', [])
            answers_by_correctness = [answer['is_correct'] for answer in answers]
            if not answers:
                raise serializers.ValidationError("Auto-checked question must be provided with answers")
            if attrs['question_type'] == Question.Type.CLOSED and (answers_by_correctness.count(False) == 0 or
                                                                   answers_by_correctness.count(True) == 0):
                raise serializers.ValidationError("Closed question must have both correct and incorrect answers "
                                                  "provided")
            if [answer['is_regex'] for answer in answers].count(True):
                raise serializers.ValidationError("Closed question cannot have regex-based answers")
        return attrs


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

    @staticmethod
    def points_validation(value: str):
        try:
            value = float(value.replace(',', '.'))
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

    @staticmethod
    def validate_integers(value):
        try:
            return int(value)
        except ValueError:
            raise serializers.ValidationError("This field should be an integer or a string representing an integer")

    def validate_least_points_awarded_percent(self, value):
        return self.validate_integers(value)

    def validate_rule_end_time(self, value):
        return self.validate_integers(value)


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
    point_source = PointSourceSerializer()
    timer_rules = TimerRuleSerializer(many=True, allow_null=True)

    class Meta:
        model = Adventure
        exclude = ['chapter', 'is_initial']

    def validate_time_limit(self, value):
        try:
            return int(value)
        except ValueError:
            raise serializers.ValidationError("This field should be an integer or a string representing an integer")

    def create(self, validated_data):
        return self.do_create(validated_data)

    def update(self, instance, validated_data):
        return self.do_create(validated_data, instance.id)

    def do_create(self, validated_data, adventure_id=None):
        point_source_data = validated_data.pop('point_source')
        timer_rules_data = validated_data.pop('timer_rules', [])
        if adventure_id:
            Adventure.objects.filter(pk=adventure_id).update(**validated_data)
            adventure = Adventure.objects.get(pk=adventure_id)
            TimerRule.objects.filter(adventure=adventure).delete()
            PointSource.objects.filter(adventure=adventure).delete()
        else:
            adventure = Adventure.objects.create(**validated_data)
        for timer_rule_data in timer_rules_data:
            TimerRule.objects.create(**timer_rule_data, adventure=adventure)
        self.create_point_source(point_source_data, adventure)
        return adventure

    def create_point_source(self, point_source_data, adventure):
        surprise_exercise_data = point_source_data.pop('surprise_exercise', {})
        questions_data = point_source_data.pop('questions', [])
        point_source = PointSource.objects.create(**point_source_data, adventure=adventure)
        if surprise_exercise_data:
            SurpriseExercise.objects.create(**surprise_exercise_data, point_source=point_source)
        for question_data in questions_data:
            self.create_question(question_data, point_source)

    def create_question(self, question_data, point_source):
        answers_data = question_data.pop('answers', [])
        question = Question.objects.create(**question_data, point_source=point_source)
        for answer_data in answers_data:
            self.create_answer(answer_data, question)

    def create_answer(self, answer_data, question):
        Answer.objects.create(**answer_data, question=question)


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
    given_answer = serializers.CharField(allow_blank=True)


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
