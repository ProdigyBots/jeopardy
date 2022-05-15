# If experiencing issues while updating models, delete db.sqlite3, and run "py manage.py migrate --run-syncdb"
from django.db import models

VALUE_CHOICES = [(200, '200'), (400, '400'), (600, '600'), (800, '800'), (1000, '1000')]

DOUBLE_VALUE_CHOICES = [(400, '400'), (800, '800'), (1200, '1200'), (1600, '1600'), (2000, '2000')]

class Answer(models.Model):
    text = models.CharField(max_length=200)
    url = models.CharField(max_length=1000, blank=True, default='')
    value = models.PositiveIntegerField(choices=VALUE_CHOICES)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)

    def __str__(self):
        return self.text + ": $" + str(self.value)

class DoubleAnswer(models.Model):
    text = models.CharField(max_length=200)
    url = models.CharField(max_length=1000, blank=True, default='')
    value = models.PositiveIntegerField(choices=DOUBLE_VALUE_CHOICES)
    category = models.ForeignKey('DoubleCategory', on_delete=models.CASCADE)

    def __str__(self):
        return self.text + ": $" + str(self.value)

    class Meta:
        verbose_name = 'Double Jeopardy Answer'
        verbose_name_plural = 'Double Jeopardy Answers'

class Category(models.Model):
    name = models.CharField(max_length=50)
    topic = models.CharField(max_length=20)

    def __str__(self):
        return self.name
        
    class Meta:
        verbose_name_plural = 'Categories'

class DoubleCategory(models.Model):
    name = models.CharField(max_length=50)
    topic = models.CharField(max_length=20)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Double Jeopardy Category'
        verbose_name_plural = 'Double Jeopardy Categories'