# Generated by Django 3.0.5 on 2020-06-04 12:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('golfplatz', '0021_auto_20200531_1345'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='is_multiple_choice',
            field=models.BooleanField(default=False),
        ),
    ]
