FROM node as frontend
RUN mkdir app
WORKDIR app
COPY frontend/package.json frontend/webpack.config.js frontend/.babelrc ./
RUN npm install
RUN mkdir src
COPY frontend/src src
RUN npm run build

FROM python:3.8
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt manage.py ./
RUN pip install -r requirements.txt
COPY golfplatz /code/golfplatz
COPY Server /code/Server
COPY templates /code/templates
RUN mkdir frontend
WORKDIR ./frontend
COPY frontend/apps.py frontend/views.py frontend/urls.py ./
COPY --from=frontend app/static/frontend/main.js ./static/frontend/
WORKDIR /code
RUN python manage.py migrate
CMD gunicorn Server.wsgi:application
