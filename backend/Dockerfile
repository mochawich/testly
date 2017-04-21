FROM python:3.6

ENV PYTHONUNBUFFERED 1

# Install pip requirements
COPY ./requirements.txt /tmp/
RUN pip install -r /tmp/requirements.txt

# Install Gunicorn for serving API endpoints
RUN pip install gunicorn==19.6.0

# Install circus for running Django RQ workers
RUN pip install circus==0.14.0

# Define working directory and copy files to it
RUN mkdir /code
COPY . /code/
WORKDIR /code

# Expose Gunicorn port
EXPOSE 8000

# Command to serve API
CMD ["gunicorn", "testly.wsgi", "-c", "/code/config/gunicorn.py"]

# Command to run Celery
#CMD ["circusd", "/code/config/circus.ini"]
