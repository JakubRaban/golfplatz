# Generated by Django 3.0.5 on 2020-05-04 14:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('golfplatz', '0013_auto_20200504_1415'),
    ]

    operations = [
        migrations.AlterField(
            model_name='answer',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='golfplatz.Question'),
        ),
        migrations.AlterField(
            model_name='pointsource',
            name='adventure',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='point_source', serialize=False, to='golfplatz.Adventure'),
        ),
        migrations.AlterField(
            model_name='question',
            name='message_after_correct_answer',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='message_after_incorrect_answer',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='point_source',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='golfplatz.PointSource'),
        ),
        migrations.AlterField(
            model_name='question',
            name='points_per_correct_answer',
            field=models.DecimalField(decimal_places=3, default=1.0, max_digits=6),
        ),
        migrations.AlterField(
            model_name='question',
            name='points_per_incorrect_answer',
            field=models.DecimalField(decimal_places=3, default=0.0, max_digits=6),
        ),
        migrations.AlterField(
            model_name='surpriseexercise',
            name='point_source',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='surprise_exercise', serialize=False, to='golfplatz.PointSource'),
        ),
    ]
