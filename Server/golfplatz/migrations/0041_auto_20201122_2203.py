# Generated by Django 3.0.5 on 2020-11-22 21:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('golfplatz', '0040_weight'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='coursegroupstudents',
            name='chapters_done',
        ),
        migrations.RemoveField(
            model_name='coursegroupstudents',
            name='max_score',
        ),
        migrations.RemoveField(
            model_name='coursegroupstudents',
            name='points_scored',
        ),
    ]
