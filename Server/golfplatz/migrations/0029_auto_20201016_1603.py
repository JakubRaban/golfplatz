# Generated by Django 3.1.2 on 2020-10-16 14:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('golfplatz', '0028_auto_20201016_1408'),
    ]

    operations = [
        migrations.AlterField(
            model_name='achievement',
            name='image',
            field=models.ImageField(null=True, upload_to=''),
        ),
    ]
