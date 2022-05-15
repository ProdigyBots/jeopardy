from django.contrib import admin

from .models import Answer, DoubleAnswer, Category, DoubleCategory

admin.site.register(Answer)
admin.site.register(DoubleAnswer)
admin.site.register(Category)
admin.site.register(DoubleCategory)
