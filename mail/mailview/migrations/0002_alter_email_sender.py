# Generated by Django 4.2.3 on 2023-12-18 05:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('mailview', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='email',
            name='sender',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='your_mail', to=settings.AUTH_USER_MODEL),
        ),
    ]