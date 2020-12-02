from django.contrib.auth import authenticate
from django.core.exceptions import PermissionDenied
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

from .models import Course, CourseGroup, Participant, PlotPart, Chapter, Adventure, TimerRule, \
    Question, Answer, PointSource, Path, NextAdventureChoiceDescription, PathChoiceDescription, \
    Achievement, Grade, StudentAnswer, StudentImageAnswer, StudentTextAnswer, Rank, AccomplishedChapter, SystemKey


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user and user.is_active:
            return user
        raise PermissionDenied()


class ParticipantSerializer(serializers.ModelSerializer):
    system_key = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Participant
        fields = '__all__'

    def validate(self, attrs):
        super(ParticipantSerializer, self).validate(attrs)
        if self.context['group_name'] == 'tutor':
            key = SystemKey.get()
            if key:
                if attrs.pop('system_key', '') != key:
                    raise PermissionDenied()
            else:
                SystemKey.objects.create()
        return attrs

    def create(self, validated_data):
        validated_data.pop('system_key', '')
        return Participant.objects.create_user(**validated_data)


class ParticipantBasicDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ['first_name', 'last_name', 'email']


class CreateCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['name', 'description', 'theme_color']


class CourseGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseGroup
        fields = '__all__'


class AchievementSerializer(serializers.ModelSerializer):
    image = Base64ImageField(allow_null=True, required=False)

    class Meta:
        model = Achievement
        exclude = ['accomplished_by_students', 'course']


class RankSerializer(serializers.ModelSerializer):
    image = Base64ImageField(allow_null=True, required=False)

    class Meta:
        model = Rank
        exclude = ['course']


class WeightsSerializer(serializers.Serializer):
    QUIZ = serializers.IntegerField()
    TEST = serializers.IntegerField()
    GENERIC = serializers.IntegerField()
    HOMEWORK = serializers.IntegerField()
    ACTIVENESS = serializers.IntegerField()


class StudentScoreSerializer(serializers.Serializer):
    points_scored = serializers.DecimalField(max_digits=8, decimal_places=3)
    max_score = serializers.DecimalField(max_digits=8, decimal_places=3)
    score_percent = serializers.DecimalField(max_digits=8, decimal_places=3)
    chapters_done = serializers.IntegerField()
    rank = RankSerializer(allow_null=True)


class StudentGradesSerializer(serializers.Serializer):
    name = serializers.CharField()
    points_for_max_grade = serializers.DecimalField(max_digits=7, decimal_places=3)
    points_scored = serializers.DecimalField(max_digits=7, decimal_places=3)
    time_completed = serializers.DateTimeField()


class RankingElementSerializer(serializers.Serializer):
    student_score = StudentScoreSerializer()
    course_group_name = serializers.CharField()
    student = ParticipantBasicDataSerializer()


class PathChoiceDescriptionSerializer(serializers.Serializer):
    to_adventure = serializers.PrimaryKeyRelatedField(queryset=Adventure.objects.all())
    description = serializers.CharField()


class NextAdventureChoiceSerializer(serializers.Serializer):
    from_adventure = serializers.PrimaryKeyRelatedField(queryset=Adventure.objects.all())
    description = serializers.CharField()
    path_choices = PathChoiceDescriptionSerializer(many=True)

    def create(self, validated_data):
        path_choices_data = validated_data.pop('path_choices', [])
        NextAdventureChoiceDescription.objects.create(**validated_data)
        for path_choice_data in path_choices_data:
            path = Path.objects.get(from_adventure=validated_data['from_adventure'],
                                    to_adventure=path_choice_data['to_adventure'])
            PathChoiceDescription.objects.create(path=path, description=path_choice_data['description'])


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


class PointSourceSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

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
        exclude = ['chapter', 'is_initial', 'max_points_possible']

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
        questions_data = point_source_data.pop('questions', [])
        point_source = PointSource.objects.create(**point_source_data, adventure=adventure)
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
    plot_parts = PlotPartSerializer(many=True, read_only=True)
    course_groups = CourseGroupSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'


class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'


class GameCardAccomplishedChapterListSerializer(serializers.ListSerializer):
    def to_representation(self, instance):
        instance = instance.filter(student=self.context['request'].user)
        return super(GameCardAccomplishedChapterListSerializer, self).to_representation(instance)


class GameCardAccomplishedChapterSerializer(serializers.ModelSerializer):
    class Meta:
        list_serializer_class = GameCardAccomplishedChapterListSerializer
        model = AccomplishedChapter
        fields = ['is_completed', 'time_completed']


class GameCardChapterSerializer(serializers.ModelSerializer):
    accomplished_chapters = GameCardAccomplishedChapterSerializer(source='accomplishedchapter_set', many=True, read_only=True)

    class Meta:
        model = Chapter
        exclude = ['done_by_students']


class GameCardPlotPartSerializer(serializers.ModelSerializer):
    chapters = GameCardChapterSerializer(many=True, read_only=True)

    class Meta:
        model = PlotPart
        fields = '__all__'


class GameCardCourseSerializer(serializers.ModelSerializer):
    course_groups = serializers.StringRelatedField(many=True)
    plot_parts = GameCardPlotPartSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'


class ClosedQuestionAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    marked_answers = serializers.ListField(child=serializers.IntegerField(), allow_empty=True)


class OpenQuestionAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    given_answer = serializers.CharField(allow_blank=True)


class ImageQuestionAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    image = Base64ImageField()


class AdventureAnswerSerializer(serializers.Serializer):
    start_time = serializers.DateTimeField()
    answer_time = serializers.IntegerField()
    closed_questions = ClosedQuestionAnswerSerializer(many=True, allow_empty=True)
    open_questions = OpenQuestionAnswerSerializer(many=True, allow_empty=True)
    image_questions = ImageQuestionAnswerSerializer(many=True, allow_empty=True)


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


class AnswerScoreSerializer(serializers.Serializer):
    grade = serializers.PrimaryKeyRelatedField(queryset=Grade.objects.all())
    points = serializers.DecimalField(max_digits=6, decimal_places=3)


# Serializers for retrieving answers to be checked manually
class StudentImageAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentImageAnswer
        fields = ['image']


class StudentTextAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentTextAnswer
        fields = ['text']


class StudentAnswerSerializer(serializers.ModelSerializer):
    text_answer = StudentTextAnswerSerializer(source='studenttextanswer', allow_null=True, required=False, read_only=True)
    image_answer = StudentImageAnswerSerializer(source='studentimageanswer', allow_null=True, required=False, read_only=True)

    class Meta:
        model = StudentAnswer
        fields = '__all__'


class FilterGradeListSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        data = data.filter(awaiting_tutor_grading=True)
        return super(FilterGradeListSerializer, self).to_representation(data)


class GradeSerializer(serializers.ModelSerializer):
    student_answer = StudentAnswerSerializer(source='studentanswer', read_only=True)
    student = serializers.StringRelatedField()

    class Meta:
        list_serializer_class = FilterGradeListSerializer
        model = Grade
        fields = '__all__'


class QuestionNameSerializer(serializers.ModelSerializer):
    grades = GradeSerializer(source='grade_set', many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'points_per_correct_answer', 'points_per_incorrect_answer', 'grades']

    # def to_representation(self, instance):
    #     ret = super(QuestionNameSerializer, self).to_representation(instance)
    #     ret = [question for question in ]
    #     return ret


class PointSourceNameSerializer(serializers.ModelSerializer):
    questions = QuestionNameSerializer(many=True, read_only=True)

    class Meta:
        model = PointSource
        fields = ['questions']

    # def to_representation(self, instance):
    #     ret = super(PointSourceNameSerializer, self).to_representation(instance)
    #     ret = OrderedDict([('questions', [question for question in ret['questions'] if len(question['grades']) > 0])])
    #     ret = ret if len(ret['questions']) > 0 else None
    #     return ret


class AdventureNameSerializer(serializers.ModelSerializer):
    point_source = PointSourceNameSerializer(read_only=True)

    class Meta:
        model = Adventure
        fields = ['id', 'name', 'point_source']


class ChapterNameSerializer(serializers.ModelSerializer):
    adventures = AdventureNameSerializer(many=True, read_only=True)

    class Meta:
        model = Chapter
        fields = ['name', 'adventures']


class PlotPartNameSerializer(serializers.ModelSerializer):
    chapters = ChapterNameSerializer(many=True, read_only=True)

    class Meta:
        model = PlotPart
        fields = ['name', 'chapters']


class CourseNameSerializer(serializers.ModelSerializer):
    plot_parts = PlotPartNameSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['name', 'plot_parts']
