FROM python:3.12

RUN apt-get update && apt-get install -y \
    libreoffice \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
    
WORKDIR /usr/src/app

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]