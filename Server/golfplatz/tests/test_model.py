from django.db.utils import IntegrityError
from django.test import TestCase

from golfplatz.models import Course, PlotPart, Chapter, Adventure, Path, TimerRule, PointSource, Question, Answer


class CourseStructureTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.course1 = Course.objects.create(name="Kurs", description="Opis")
        cls.course2 = Course.objects.create(name="Kurs2", description="Opis")
        cls.plot_part1 = PlotPart.objects.create(name="Cz1", introduction="Wprowadzenie", course=cls.course1)
        cls.chapter1 = Chapter.objects.create(name='chapter', description="Opis", plot_part=cls.plot_part1,
                                              points_for_max_grade=100)
        cls.adventures = [Adventure.objects.create(name=str(i), task_description='abc',
                                                   chapter=cls.chapter1, has_time_limit=i == 0)
                          for i in range(4)]
        cls.paths = [
            Path.objects.create(from_adventure=cls.adventures[path[0]], to_adventure=cls.adventures[path[1]])
            for path in [(0, 1), (0, 2), (1, 2), (2, 3)]
        ]
        cls.point_sources = [PointSource.objects.create(adventure=adv,
                                                        category=PointSource.Category.GENERIC, is_auto_checked=True)
                             for adv in cls.adventures]
        cls.questions = [Question.objects.create(point_source=cls.point_sources[0],
                                                 text='abc',
                                                 question_type=Question.Type.CLOSED,
                                                 is_multiple_choice=True,
                                                 points_per_correct_answer=3,
                                                 points_per_incorrect_answer=-1),
                         Question.objects.create(point_source=cls.point_sources[0],
                                                 text='def',
                                                 question_type=Question.Type.OPEN),
                         Question.objects.create(point_source=cls.point_sources[0],
                                                 text='ghi',
                                                 question_type=Question.Type.OPEN)]
        cls.closed_answers = [Answer.objects.create(text=t[0], is_correct=t[1],
                                                    is_regex=False, question=cls.questions[0])
                              for t in [('A', True), ('B', True), ('C', False), ('D', False)]]
        Answer.objects.create(text="Tak", is_correct=True, question=cls.questions[1])
        Answer.objects.create(text="Nie", is_correct=True, question=cls.questions[1])
        Answer.objects.create(text=r"abc\d{1,3}", is_correct=True, is_regex=True, question=cls.questions[2])

    def test_duplicate_course_name_fails(self):
        with self.assertRaises(IntegrityError):
            Course.objects.create(name="Kurs", description="Opis2")

    def test_plot_part_is_created_and_properly_assigned_position_in_course(self):
        pp = PlotPart.objects.create(name='pp1', introduction='ppo1', course=self.course1)
        self.assertEquals(pp.position_in_course, 2)
        pp2 = PlotPart.objects.create(name='pp2', introduction='ppo2', course=self.course1)
        self.assertEquals(pp2.position_in_course, 3)
        pp3 = PlotPart.objects.create(name='pp2', introduction='ppo2', course=self.course2)
        self.assertEquals(pp3.position_in_course, 1)

    def test_duplicate_plot_part_name_within_same_course_fails(self):
        pp = PlotPart.objects.create(name="pp3", introduction="abc", course=self.course1)
        with self.assertRaises(IntegrityError):
            pp2 = PlotPart.objects.create(name="pp3", introduction="ert", course=self.course1)

    def test_duplicate_course_group_name_within_same_course_fails(self):
        with self.assertRaises(IntegrityError):
            self.course1.add_course_groups(["a", "a"])

    def test_can_add_same_course_group_name_in_different_courses(self):
        self.course1.add_course_groups(["a"])
        self.course2.add_course_groups(["a"])

    def test_duplicate_chapter_name_in_same_plot_part_fails(self):
        pp = PlotPart.objects.create(name='tdc', introduction='tdc', course=self.course1)
        ch1 = Chapter.objects.create(name='ch1', description='ch1', plot_part=pp, points_for_max_grade=100)
        with self.assertRaises(IntegrityError):
            ch2 = Chapter.objects.create(name='ch1', description='ch12', plot_part=pp, points_for_max_grade=100)

    def test_chapter_is_created_and_properly_assigned_position_in_plot_part(self):
        p = PlotPart.objects.create(name='ttcc', introduction='abc', course=self.course1)
        p2 = PlotPart.objects.create(name='ttcc2', introduction='abc', course=self.course1)
        c1 = Chapter.objects.create(name='pp12', description='abc', plot_part=p, points_for_max_grade=1)
        self.assertEquals(c1.position_in_plot_part, 1)
        c2 = Chapter.objects.create(name='pp22', description='ppo2', plot_part=p, points_for_max_grade=1)
        self.assertEquals(c2.position_in_plot_part, 2)
        c3 = Chapter.objects.create(name='pp12', description='ppo2', plot_part=p2, points_for_max_grade=1)
        self.assertEquals(c3.position_in_plot_part, 1)

    def test_chapter_get_paths(self):
        self.assertEquals(len(self.paths), len(self.chapter1.get_paths()))
        for path in self.chapter1.get_paths():
            self.assertIn(path, self.paths)

    def test_adventure_get_time_modifier_with_time_limit(self):
        adv_with_limit = self.adventures[0]
        adv_without_limit = self.adventures[1]
        rule_none = TimerRule.DecreasingMethod.NONE
        rule_lin = TimerRule.DecreasingMethod.LINEAR
        timer_rules = [TimerRule.objects.create(rule_end_time=param[0], decreasing_method=param[1],
                                                least_points_awarded_percent=param[2], adventure=adv)
                       for param in [(30, rule_none, 100), (60, rule_none, 50), (120, rule_lin, 30)]
                       for adv in [adv_with_limit, adv_without_limit]]
        for adv in [adv_with_limit, adv_without_limit]:
            self.assertEquals(adv.get_time_modifier(20), 100)
            self.assertEquals(adv.get_time_modifier(30), 100)  # up to 30 sec 100%
            self.assertEquals(adv.get_time_modifier(31), 50)  # from 30 to 60 sec 50%
            self.assertEquals(adv.get_time_modifier(60), 50)
            self.assertEquals(adv.get_time_modifier(90), 40)  # linearly from 50% to 30% from 60 to 120 sec
            self.assertEquals(adv.get_time_modifier(104), 35)  # rounding down float percent values
            self.assertEquals(adv.get_time_modifier(105), 35)
            self.assertEquals(adv.get_time_modifier(120), 30)

        self.assertEquals(adv_with_limit.get_time_modifier(121), 0)  # after last threshold 0% with time limit
        self.assertEquals(adv_with_limit.get_time_modifier(200), 0)

        self.assertEquals(adv_without_limit.get_time_modifier(121), 30)  # or equal to last threshold if no time limit
        self.assertEquals(adv_without_limit.get_time_modifier(200), 30)

    def test_paths_from_adventure(self):
        self.assertEquals(len(self.adventures[0].paths_from_here), 2)
        self.assertEquals(len(self.adventures[3].paths_from_here), 0)

    def test_adventure_next_adventures(self):
        for adv in self.adventures[0].next_adventures:
            self.assertIn(adv, self.adventures[1:3])
        self.assertEquals(len(self.adventures[3].next_adventures), 0)

    def test_question_points_for_answer(self):
        question = self.questions[0]
        self.assertEquals(question._points_for_answer(self.closed_answers[0]), 3)
        self.assertEquals(question._points_for_answer(self.closed_answers[2]), -1)
        self.assertEquals(question._points_for_answer(self.closed_answers[2],
                                                      invert=True), 3)

    def test_question_score_for_closed_question(self):
        question = self.questions[0]
        self.assertEquals(question.score_for_closed_question(set(self.closed_answers[:2])), 12)
        self.assertEquals(question.score_for_closed_question(set(self.closed_answers[1:3])), 4)
        self.assertEquals(question.score_for_closed_question(set(self.closed_answers[2:])), -4)
        self.assertEquals(question.score_for_closed_question(set(self.closed_answers[:3])), 8)
        self.assertEquals(question.score_for_closed_question({}), -1)

    def test_question_score_for_open_question(self):
        question = self.questions[1]
        self.assertEquals(question.score_for_open_question("tak"), 1)
        self.assertEquals(question.score_for_open_question("TAK"), 1)
        self.assertEquals(question.score_for_open_question("tAk"), 1)
        self.assertEquals(question.score_for_open_question("Takk"), 0)
        self.assertEquals(question.score_for_open_question("niE"), 1)

    def test_question_score_for_open_question_with_regex(self):
        question = self.questions[2]
        self.assertEquals(question.score_for_open_question("abc5"), 1)
        self.assertEquals(question.score_for_open_question("abc802"), 1)
        self.assertEquals(question.score_for_open_question("AbC555"), 1)
        self.assertEquals(question.score_for_open_question("abC1234"), 0)
