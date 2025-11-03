from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
import os

load_dotenv()  # loads OPENAI_API_KEY from .env if present

app = FastAPI()

# Try to import ChatOpenAI safely.
llm = None
llm_available = False
try:
    from langchain_openai import ChatOpenAI

    try:
        llm = ChatOpenAI(model="gpt-4-turbo")
        llm_available = True
    except Exception as e:
        print(f"[ResearcherAgent] LLM init failed: {e}")
        llm = None
        llm_available = False
except Exception as e:
    print(f"[ResearcherAgent] Could not import ChatOpenAI: {e}")
    ChatOpenAI = None
    llm = None
    llm_available = False


def web_search(query: str) -> str:
    """Stub function to simulate a web search."""
    return f"Search results for '{query}': ..."


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
    query = data.get("query")
    if not query:
        raise HTTPException(status_code=400, detail="Missing 'query' in request body")

    # Run stubbed web search
    search_results = web_search(query)
    response = {"search": search_results}

    api_key = os.environ.get("OPENAI_API_KEY")

    # Skip LLM if no key
    if not api_key:
        response["llm_summary_error"] = "OPENAI_API_KEY not set; skipping LLM summary"
        return {"role": "researcher", "result": response}

    # Basic API key validation
    if not isinstance(api_key, str) or not api_key.startswith("sk-"):
        response["llm_summary_error"] = "OPENAI_API_KEY appears invalid; skipping LLM summary"
        return {"role": "researcher", "result": response}

    # Try summarizing with the available LLM
    if llm_available and llm is not None:
        try:
            if hasattr(llm, "invoke"):
                # ✅ Modern LangChain API
                lm_out = llm.invoke(f"Summarize these results:\n{search_results}")
                response["llm_summary"] = extract_text_from_llm(lm_out)
            elif hasattr(llm, "chat"):
                # Legacy compatibility
                lm_out = llm.chat([{"role": "user", "content": f"Summarize: {search_results}"}])
                response["llm_summary"] = extract_text_from_llm(lm_out)
            elif hasattr(llm, "generate"):
                lm_out = llm.generate([search_results])
                response["llm_summary"] = extract_text_from_llm(lm_out)
            else:
                response["llm_summary"] = "LLM available but no compatible call method detected."
        except Exception as e:
            response["llm_summary_error"] = f"LLM summary failed: {e}"
    else:
        response["llm_summary_error"] = "LLM not initialized or unavailable."

    return {"role": "researcher", "result": response}
