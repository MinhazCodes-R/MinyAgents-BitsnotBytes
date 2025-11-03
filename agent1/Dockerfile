FROM python:3.11-slim

WORKDIR /app
COPY . .
COPY ../requirements.txt .


RUN pip install --no-cache-dir -r requirements.txt

# Copy this agent’s source folder into /app
CMD ["uvicorn", "agent1.agent1_server:app", "--host", "0.0.0.0", "--port", "8000"]

