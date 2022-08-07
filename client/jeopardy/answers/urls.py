from __future__ import print_function

import os.path

from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from dotenv import load_dotenv

from django.urls import path
from . import views
from .models import Answer, DoubleAnswer, Category, DoubleCategory

urlpatterns = [
    path('', views.index, name='index'),
    path('double', views.double, name='double')
]

load_dotenv()

# Scope & Spreadsheet ID
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
SPREADSHEET_ID = os.getenv("SPREADSHEET_ID")

# Spreadsheet Range
CATEGORIES = ['A2', 'A8', 'A14', 'A20', 'A26', 'A32']
ANSWERS = ['B3:B7', 'B9:B13', 'B15:B19', 'B21:B25', 'B27:B31', 'B33:B37']
DOUBLE_CATEGORIES = ['A40', 'A46', 'A52', 'A58', 'A64', 'A70']
DOUBLE_ANSWERS = ['B41:B45', 'B47:B51', 'B53:B57', 'B59:B63', 'B65:B69', 'B71:B75']

def import_spreadsheet():
    """
    Import all data from a given Google 
    Spreadsheet, and generate the game.
    """
    creds = None
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                os.path.join(os.getcwd() + '/answers/static/answers/', 'credentials.json'), SCOPES)
            creds = flow.run_local_server(port=0)

        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    service = build('sheets', 'v4', credentials=creds)
    sheet = service.spreadsheets()

    answerIndex = 0
    for category in CATEGORIES:
        result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range="Questions!" + category).execute()
        values = result.get('values', [])

        new_category = Category(name=values[0][0], topic="BETA")
        new_category.save()

        result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range="Questions!" + ANSWERS[answerIndex]).execute()
        values = result.get('values', [])

        for i in range(1, 6):
            if '[' and ']' in values[i - 1][0]:
                image_url = values[i - 1][0].replace("[", "").split("]")[0]
                question = values[i - 1][0].replace("[", "").split("]")[1]

                new_answer = Answer(text=question, url=image_url, value=(i * 200), category=new_category)
                new_answer.save()
            else:
                new_answer = Answer(text=values[i - 1][0], url="", value=(i * 200), category=new_category)
                new_answer.save()

        answerIndex += 1
        
    doubleAnswerIndex = 0
    for doubleCategory in DOUBLE_CATEGORIES:
        result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range="Questions!" + doubleCategory).execute()
        values = result.get('values', [])

        new_category = DoubleCategory(name=values[0][0], topic="BETA")
        new_category.save()

        result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range="Questions!" + DOUBLE_ANSWERS[doubleAnswerIndex]).execute()
        values = result.get('values', [])

        for i in range(1, 6):
            if '[' and ']' in values[i - 1][0]:
                image_url = values[i - 1][0].replace("[", "").split("]")[0]
                question = values[i - 1][0].replace("[", "").split("]")[1]

                new_answer = DoubleAnswer(text=question, url=image_url, value=(i * 400), category=new_category)
                new_answer.save()
            else:
                new_answer = DoubleAnswer(text=values[i - 1][0], url="", value=(i * 400), category=new_category)
                new_answer.save()
            
        doubleAnswerIndex += 1

"""
If there are no answers, import them from the spreadsheet!

Note: import_spreadsheet() cannot be called immediately
if DB was recently deleted and/or needs to be regenerated.
"""
if Answer.objects.count() <= 0 or DoubleAnswer.objects.count() <= 0:
    print("Importing spreadsheet..")
    import_spreadsheet()
