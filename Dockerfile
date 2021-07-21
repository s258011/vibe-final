FROM python:3.8-slim-buster

ENV PORT 8080
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./
RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y
RUN pip3 install -r requirements.txt
RUN pip3 install --upgrade tensorflow
RUN pip3 install --upgrade tensorflow-gpu
EXPOSE 8080
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 main:app
