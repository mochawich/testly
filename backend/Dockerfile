FROM python:3.6

ENV PYTHONUNBUFFERED 1

# Install pip requirements
COPY ./requirements.txt /tmp/
RUN pip install -r /tmp/requirements.txt

# Install Gunicorn for serving API endpoints
RUN pip install gunicorn==19.6.0

# Define working directory and copy files to it
RUN mkdir /code
COPY . /code/
WORKDIR /code

# Expose Gunicorn port
EXPOSE 8000

# Command to serve API
CMD ["gunicorn", "testly.wsgi", "-c", "/code/config/gunicorn.py"]

# Command to run Django RQ workers
#CMD ["python", "manage.py", "rqworker", "testly-default"]
