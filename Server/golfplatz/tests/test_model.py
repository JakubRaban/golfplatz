from django.db.utils import IntegrityError
from django.test import TestCase

from golfplatz.models import Course, PlotPart, Chapter


class CourseStructureTest(TestCase):
    def setUp(self) -> None:
        self.c = Course.objects.create(name="Kurs", description="Opis")
        self.d = Course.objects.create(name="Kurs2", description="Opis")

    def test_duplicate_course_name_fails(self):
        with self.assertRaises(IntegrityError):
            Course.objects.create(name="Kurs", description="Opis2")

    def test_plot_part_is_created_and_properly_assigned_position_in_course(self):
        pp = PlotPart.objects.create(name='pp1', introduction='ppo1', course=self.c)
        self.assertEquals(pp.position_in_course, 1)
        pp2 = PlotPart.objects.create(name='pp2', introduction='ppo2', course=self.c)
        self.assertEquals(pp2.position_in_course, 2)
        pp3 = PlotPart.objects.create(name='pp2', introduction='ppo2', course=self.d)
        self.assertEquals(pp3.position_in_course, 1)

    def test_duplicate_plot_part_name_within_same_course_fails(self):
        pp = PlotPart.objects.create(name="pp3", introduction="abc", course=self.c)
        with self.assertRaises(IntegrityError):
            pp2 = PlotPart.objects.create(name="pp3", introduction="ert", course=self.c)

    def test_duplicate_course_group_name_within_same_course_fails(self):
        with self.assertRaises(IntegrityError):
            self.c.add_course_groups(["a", "a"])

    def test_can_add_same_course_group_name_in_different_courses(self):
        self.c.add_course_groups(["a"])
        self.d.add_course_groups(["a"])

    def test_duplicate_chapter_name_in_same_plot_part_fails(self):
        pp = PlotPart.objects.create(name='tdc', introduction='tdc', course=self.c)
        ch1 = Chapter.objects.create(name='ch1', description='ch1', plot_part=pp, points_for_max_grade=100)
        with self.assertRaises(IntegrityError):
            ch2 = Chapter.objects.create(name='ch1', description='ch12', plot_part=pp, points_for_max_grade=100)

    def test_chapter_is_created_and_properly_assigned_position_in_plot_part(self):
        p = PlotPart.objects.create(name='ttcc', introduction='abc', course=self.c)
        p2 = PlotPart.objects.create(name='ttcc2', introduction='abc', course=self.c)
        c1 = Chapter.objects.create(name='pp12', description='abc', plot_part=p, points_for_max_grade=1)
        self.assertEquals(c1.position_in_plot_part, 1)
        c2 = Chapter.objects.create(name='pp22', description='ppo2', plot_part=p, points_for_max_grade=1)
        self.assertEquals(c2.position_in_plot_part, 2)
        c3 = Chapter.objects.create(name='pp12', description='ppo2', plot_part=p2, points_for_max_grade=1)
        self.assertEquals(c3.position_in_plot_part, 1)
