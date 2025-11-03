from fastapi import FastAPI
import importlib.util
import os


def load_app_from_path(path: str):
    """Dynamically load a module from a file path and return its `app` attribute."""
    spec = importlib.util.spec_from_file_location(os.path.splitext(os.path.basename(path))[0], path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return getattr(mod, "app")


base = FastAPI()

# Paths for the three agent modules
ROOT = os.path.dirname(__file__)
coder_path = os.path.join(ROOT, "coder-agent.py")
writer_path = os.path.join(ROOT, "writer-agent.py")
researcher_path = os.path.join(ROOT, "researcher-agent.py")

# Mount each agent as a sub-app
try:
    coder_app = load_app_from_path(coder_path)
    base.mount("/coder", coder_app)
except Exception as e:
    print(f"Failed to mount coder agent: {e}")

try:
    writer_app = load_app_from_path(writer_path)
    base.mount("/writer", writer_app)
except Exception as e:
    print(f"Failed to mount writer agent: {e}")

try:
    researcher_app = load_app_from_path(researcher_path)
    base.mount("/researcher", researcher_app)
except Exception as e:
    print(f"Failed to mount researcher agent: {e}")


@base.get("/")
def root():
    return {"agents": ["/coder", "/writer", "/researcher"]}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("run_all_agents:base", host="127.0.0.1", port=8001, reload=False)
