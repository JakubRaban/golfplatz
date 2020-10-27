FROM node as frontend
RUN mkdir app
WORKDIR app
COPY frontend/package.json frontend/webpack.config.js frontend/.babelrc ./
RUN npm install
RUN mkdir src
COPY frontend/src src
RUN npm run build

FROM python:3.8
ENV PYTHONBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY golfplatz Server templates /code/
RUN mkdir frontend
WORKDIR ./frontend
COPY --from=frontend app/static/frontend/main.js .
#ENTRYPOINT python /code/manage.py migrate && python /code/manage.py runserver 0.0.0.0:8000
