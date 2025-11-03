from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# Best-effort LLM import
llm = None
llm_available = False
try:
    from langchain_openai import ChatOpenAI
    try:
        llm = ChatOpenAI(model="gpt-4-turbo")
        llm_available = True
    except Exception:
        llm = None
        llm_available = False
except Exception:
    llm = None
    llm_available = False


def generate_summary_stub(text: str) -> str:
    return f"Summary (stub): {text[:200]}{'...' if len(text) > 200 else ''}"


def extract_text_from_llm(result) -> str:
    if result is None:
        return ""
    if isinstance(result, str):
        return result
    if hasattr(result, "content"):
        try:
            return getattr(result, "content") or ""
        except Exception:
            pass
    if isinstance(result, dict):
        for key in ("text", "content", "output_text"):
            if key in result and isinstance(result[key], str):
                return result[key]
    if hasattr(result, "generations"):
        gens = getattr(result, "generations")
        try:
            first = gens[0]
            if isinstance(first, list):
                first = first[0]
            for attr in ("text", "content"):
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
    inputs = data.get("inputs")
    if not inputs:
        raise HTTPException(status_code=400, detail="Missing 'inputs' in request body")

    if llm_available and llm is not None:
        try:
            if hasattr(llm, "invoke"):
                result = llm.invoke(inputs)
                output = extract_text_from_llm(result)
            elif hasattr(llm, "generate"):
                out = llm.generate([inputs])
                output = extract_text_from_llm(out)
            else:
                output = generate_summary_stub(inputs)
        except Exception as e:
            output = generate_summary_stub(inputs) + f"\n# llm error: {e}"
    else:
        output = generate_summary_stub(inputs)

    return {"role": "writer", "output": output}
