# Generated by Django 3.0.5 on 2020-05-31 11:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('golfplatz', '0020_question_question_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='adventure',
            name='is_terminal',
        ),
        migrations.AddConstraint(
            model_name='accomplishedadventure',
            constraint=models.UniqueConstraint(fields=('student', 'adventure'), name='student_accomplishes_adventure_once'),
        ),
        migrations.AddConstraint(
            model_name='timerrule',
            constraint=models.UniqueConstraint(fields=('rule_end_time', 'adventure'), name='single_rule_for_end_time_in_adventure'),
        ),
    ]