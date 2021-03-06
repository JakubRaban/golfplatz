# Generated by Django 3.0.5 on 2020-05-04 12:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('golfplatz', '0011_auto_20200504_1351'),
    ]

    operations = [
        migrations.CreateModel(
            name='Grade',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('points_scored', models.DecimalField(decimal_places=3, max_digits=6)),
            ],
        ),
        migrations.CreateModel(
            name='PointSource',
            fields=[
                ('adventure', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='golfplatz.Adventure')),
                ('category', models.CharField(choices=[('QUIZ', 'Quiz'), ('SURPRISE', 'Surprise exercise'), ('GENERIC', 'Generic lab exercise'), ('ACTIVENESS', 'Activeness'), ('TEST', 'Test'), ('HOMEWORK', 'Homework or project')], max_length=10)),
                ('input_type', models.CharField(choices=[('NONE', 'None'), ('TEXTFIELD', 'Small text field'), ('TEXTAREA', 'Large text area')], default='NONE', max_length=9)),
            ],
        ),
        migrations.CreateModel(
            name='SurpriseExercise',
            fields=[
                ('point_source', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='golfplatz.PointSource')),
                ('earliest_possible_send_time', models.DateTimeField()),
                ('latest_possible_send_time', models.DateTimeField()),
                ('sending_method', models.CharField(choices=[('EMAIL', 'Email'), ('PHONE', 'Phone')], max_length=5)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=250)),
                ('question_type', models.CharField(choices=[('OPEN', 'Open question'), ('CLOSED', 'Closed question')], max_length=6)),
                ('points_per_correct_answer', models.DecimalField(decimal_places=3, max_digits=6)),
                ('points_per_incorrect_answer', models.DecimalField(decimal_places=3, max_digits=6)),
                ('message_after_correct_answer', models.TextField()),
                ('message_after_incorrect_answer', models.TextField()),
                ('grades', models.ManyToManyField(through='golfplatz.Grade', to=settings.AUTH_USER_MODEL)),
                ('point_source', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='golfplatz.PointSource')),
            ],
        ),
        migrations.AddField(
            model_name='grade',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='golfplatz.Question'),
        ),
        migrations.AddField(
            model_name='grade',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=250)),
                ('is_correct', models.BooleanField()),
                ('is_regex', models.BooleanField(default=False)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='golfplatz.Question')),
            ],
        ),
    ]
