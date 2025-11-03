from langchain.agents import create_agent

# Define simple example tools for each agent
def tool_agent1(input: str) -> str:
    """Returns a confirmation that the agent1 processed the input"""
    return f"Agent1 processed: {input}"

# Create three separate agents
agent1 = create_agent(
    model="openai:gpt-4o",
    tools=[tool_agent1],
    system_prompt="You are Agent 1, a helpful assistant."
)
