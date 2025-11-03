# agent1_server.py example
from fastapi import FastAPI
from pydantic import BaseModel
from agent3 import agent

app = FastAPI()

class Query(BaseModel):
    messages: list

@app.post("/invoke")
async def invoke_agent(query: Query):
    response = agent.agent3.invoke({"messages": query.messages})
    return response
