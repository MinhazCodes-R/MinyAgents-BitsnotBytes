# MinyAgents-BitsnotBytes
Canada DevOps Community of Practice - Toronto Hackathon Series - Team 14 

Project Name - MinyAgents | BitsnotBytes
Team Mentor -

Participant Names - 

     Team Lead - Minhazur Rakin
     Team Members - Abhi Bashyal, Anirudh Mahesh, Bacem Karray, Kasahn Rauf


# How to Run MinyAgents

## Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- Make sure you’re in the project root (where `docker-compose.yml` is)

---

## Run the project

### Build and run everything
```bash
docker compose up --build
```
This builds all containers (agent1, agent2, agent3, and frontend if included) and starts them.


Access the services  
agent1	http://localhost:7001/invoke  
agent2	http://localhost:7002/invoke  
agent3	http://localhost:7003/invoke  
frontend  http://localhost:3000  
