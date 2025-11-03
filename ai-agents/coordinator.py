from fastapi import FastAPI, HTTPException
import requests

app = FastAPI()

# URLs of your agents
RESEARCHER_URL = "http://127.0.0.1:8001/task"
CODER_URL = "http://127.0.0.1:8002/task"
WRITER_URL = "http://127.0.0.1:8003/task"


@app.post("/run")
def run_pipeline(data: dict):
    user_query = data.get("query")
    if not user_query:
        raise HTTPException(status_code=400, detail="Missing 'query' in request body")

    try:
        # 1️⃣ Step 1: Ask the Researcher agent
        print("→ Sending query to Researcher...")
        research_response = requests.post(RESEARCHER_URL, json={"query": user_query}, timeout=120)
        research_data = research_response.json()
        research_summary = (
            research_data.get("result", {}).get("llm_summary")
            or research_data.get("result", {}).get("search", "")
        )
        print("✓ Research complete.")

        # 2️⃣ Step 2: Send research summary to the Coder agent
        print("→ Sending summary to Coder...")
        coder_response = requests.post(CODER_URL, json={"task": research_summary}, timeout=120)
        coder_data = coder_response.json()
        code_output = coder_data.get("code") or coder_data.get("result", {}).get("code")
        print("✓ Code generated.")

        # 3️⃣ Step 3: Send research + code to the Writer agent
        print("→ Sending output to Writer...")
        writer_prompt = f"Research Summary:\n{research_summary}\n\nCode:\n{code_output}\n\nWrite a blog-style explanation."
        writer_response = requests.post(WRITER_URL, json={"inputs": writer_prompt}, timeout=120)
        writer_data = writer_response.json()
        final_output = writer_data.get("output") or writer_data.get("result", {}).get("output")
        print("✓ Writing complete.")

        # ✅ Return final structured result
        return {
            "query": user_query,
            "research_summary": research_summary,
            "code_snippet": code_output,
            "final_output": final_output,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
