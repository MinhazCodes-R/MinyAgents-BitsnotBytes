from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
import os

load_dotenv()  # Load OPENAI_API_KEY if present

app = FastAPI()

# Safe import of ChatOpenAI
llm = None
llm_available = False
try:
    from langchain_openai import ChatOpenAI
    try:
        llm = ChatOpenAI(model="gpt-4-turbo")
        llm_available = True
    except Exception as e:
        print(f"[CoderAgent] LLM init failed: {e}")
        llm = None
except Exception as e:
    print(f"[CoderAgent] Could not import ChatOpenAI: {e}")
    ChatOpenAI = None
    llm = None


def extract_text_from_llm(result) -> str:
    """Normalize LLM wrapper outputs to plain text."""
    if result is None:
        return ""
    if isinstance(result, str):
        return result
    if hasattr(result, "content"):
        try:
            return result.content or ""
        except Exception:
            pass
    if isinstance(result, dict):
        for key in ("text", "content", "message", "output_text", "response"):
            if key in result and isinstance(result[key], str):
                return result[key]
    if hasattr(result, "generations"):
        try:
            gens = getattr(result, "generations")
            first = gens[0][0] if isinstance(gens[0], list) else gens[0]
            for attr in ("text", "content", "generation_text"):
                if hasattr(first, attr):
                    return getattr(first, attr) or ""
        except Exception:
            pass
    try:
        return str(result)
    except Exception:
        return ""


@app.post("/task")
def handle_task(data: dict):
    task = data.get("task")
    if not task:
        raise HTTPException(status_code=400, detail="Missing 'task' in request body")

    api_key = os.environ.get("OPENAI_API_KEY")
    response = {"task": task}

    if not api_key:
        response["code_error"] = "OPENAI_API_KEY not set; returning mock code."
        response["code"] = f"# Mock code for: {task}\nprint('Task: {task}')"
        return {"role": "coder", **response}

    if llm_available and llm is not None:
        try:
            prompt = f"Write clean, efficient Python code that accomplishes the following:\n{task}\nInclude helpful comments."
            result = llm.invoke(prompt)
            code = extract_text_from_llm(result)
            response["code"] = code
        except Exception as e:
            response["code_error"] = f"LLM code generation failed: {e}"
    else:
        response["code_error"] = "LLM not available; returning mock code."
        response["code"] = f"# Mock code for: {task}\nprint('Task: {task}')"

    return {"role": "coder", **response}
