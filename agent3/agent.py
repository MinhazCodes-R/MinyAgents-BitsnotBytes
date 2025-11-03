from langchain.agents import create_agent

# Define simple example tools for each agent
def tool_agent3(input: str) -> str:
    """Returns a confirmation that the agent3 processed the input"""
    return f"Agent3 processed: {input}"

# Create three separate agents
agent3 = create_agent(
    model="openai:gpt-4o",
    tools=[tool_agent3],
    system_prompt="You are Agent 3, a helpful assistant."
)
