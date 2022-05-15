from django.shortcuts import render

from .models import Answer, DoubleAnswer, Category, DoubleCategory

def index(request):
    return render(request, 'answers/index.html', { 
        'categories': Category.objects.all(), 
        'answers': Answer.objects.all() 
    })

def double(request): 
    return render(request, 'answers/double.html', { 
        'categories': DoubleCategory.objects.all(), 
        'answers': DoubleAnswer.objects.all() 
    })
