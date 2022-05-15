FROM python:3.9-slim-buster

COPY /client/jeopardy/requirements.txt /opt/app/requirements.txt 

WORKDIR /opt/app/

RUN pip install -r /opt/app/requirements.txt

COPY . /opt/app/

ENTRYPOINT [ "python", "manage.py", "runserver" ]