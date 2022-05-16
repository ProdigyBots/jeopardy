# Jeopardy (work in progress!)
This..is..Jeopardy! This application is based off the [popular American television quiz game show, Jeopardy](https://en.wikipedia.org/wiki/Jeopardy!). The point of this game is that you're given the answer and reply with a question; hence the question you answer with is the answer.

I was originally inspired to make my own Jeopardy in August 2019, since my family enjoyed the show. I couldn't find any easy solutions, so I made one! Another decision was how to make it most enjoyable; I thought that we could put it up on our TV, and as it turns out, our Samsung television has a built-in Internet Browser, meaning the television could connect to a webpage where I put up the answers. However, this application would definitely work with any sort of monitor, or anything that can connect to the internet.

Disclaimer: All rights involving the "Jeopardy!" game show go to Jeopardy Productions, Inc. and Sony Pictures Entertainment Inc.; this application is intended to be a clone purely for fun and web development experience.

## Structure
**Jeopardy Site**

The main feature of this application is the [Django](https://www.djangoproject.com) based Jeopardy website. The Jeopardy website currently contains five different features. Additionally, a Django-generated administration panel for questions/answers is provided.
- [**answers**](https://github.com/ezrichards/jeopardy/tree/master/client/jeopardy/answers) - The main game page showing answers and values.
- [**buzzer (WIP)**](https://github.com/ezrichards/jeopardy/tree/master/client/jeopardy/buzzer) - A web-based buzzer for contestants.
- [**core**](https://github.com/ezrichards/jeopardy/tree/master/client/jeopardy/core) - A core landing page for the whole site.
- [**jadmin**](https://github.com/ezrichards/jeopardy/tree/master/client/jeopardy/jadmin) - A game administration panel to keep track of scores and contestants.
- [**jstatistics (WIP)**](https://github.com/ezrichards/jeopardy/tree/master/client/jeopardy/jstatistics) - An in-progress statistics page for each contestant.
- **admin** - An administration panel where categories and answers can be modified, added, or removed after import.

## Running The Application

```
docker build -t jeopardy .
docker run -dp 8000:8000 --rm jeopardy
docker run -dp 8000:8000 jeopardy
```

**Website**
While in the `/client/jeopardy/` directory, simply run the Django command `python3 manage.py runserver`, substituting `python` for whatever your OS normally uses.

**Backend Server**
The backend of this site is made with NodeJS, and sends/receives sockets between the applications, using socket.io.

## Importing from Google Sheets
This application utilizes the [Google Sheets API for Python (v4)](https://developers.google.com/sheets/api/quickstart/python) for a very easy and streamlined answer importing system. 

A template for the jeopardy question-making can be [found here](https://docs.google.com/spreadsheets/d/1kFi30-9767fQXkeUFy7eEu5M052X_tSRuffsF2dPjec/edit?usp=sharing). Use Google's "File > Make A Copy" feature to make an editable copy.

After [creating a Google Cloud Platform project](https://cloud.google.com/resource-manager/docs/creating-managing-projects), generate a `credentials.json` file on the [Google Cloud Platform](https://console.cloud.google.com/apis/credentials) site. Create a new credential under "OAuth Client ID" and make the application type "Desktop"; then, download the JSON file provided and rename it to `credentials.json`. Place the `credentials.json` file into the `client/jeopardy/answers/static/answers/` directory.

Open the Google Sheets file that you wish to import from. The full url will look something like:
`https://docs.google.com/spreadsheets/d/13ZOxTVfUR6o2pvJye091LeqS1Vva-zgZfyLt7l1mzFo/edit#gid=0`

Inspect the URL for the spreadsheet ID (typically found after `d/` and before `/edit`):
`13ZOxTVfUR6o2pvJye091LeqS1Vva-zgZfyLt7l1mzFo`

Place the spreadsheet ID into the `.env` file under the `SPREADSHEET_ID` key.

Note that the `.env` file (found in the root directory) needs a corresponding Django secret key (tutorial on [how to generate one here](https://saasitive.com/tutorial/generate-django-secret-key/)). The `.env` file should look like:
```
SECRET_KEY="<key>"
SPREADSHEET_ID="<id>"
```
