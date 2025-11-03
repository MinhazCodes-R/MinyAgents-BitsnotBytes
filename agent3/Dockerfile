FROM python:3.11-slim

WORKDIR /app
COPY . .
COPY ../requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

CMD ["uvicorn", "agent3.agent3_server:app", "--host", "0.0.0.0", "--port", "8000"]
