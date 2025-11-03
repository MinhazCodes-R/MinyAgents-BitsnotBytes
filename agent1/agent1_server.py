# agent1_server.py example
from fastapi import FastAPI
from pydantic import BaseModel
from agent1 import agent

app = FastAPI()

class Query(BaseModel):
    messages: list

@app.post("/invoke")
async def invoke_agent(query: Query):
    response = agent.agent1.invoke({"messages": query.messages})
    return response
