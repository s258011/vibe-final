FROM python:3.8-slim-buster

ENV PORT 8080
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

RUN pip3 install -r requirements.txt
RUN pip3 install tensorflow --upgrade --force-reinstall
RUN pip3 install tensorflow-gpu --upgrade --force-reinstall
EXPOSE 8080
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 main:app
