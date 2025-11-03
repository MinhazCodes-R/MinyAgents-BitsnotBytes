from langchain.agents import create_agent

# Define simple example tools for each agent
def tool_agent2(input: str) -> str:
    """Returns a confirmation that the agent2 processed the input"""
    return f"Agent2 processed: {input}"

# Create three separate agents
agent2 = create_agent(
    model="openai:gpt-4o",
    tools=[tool_agent2],
    system_prompt="You are Agent 2, a helpful assistant."
)
