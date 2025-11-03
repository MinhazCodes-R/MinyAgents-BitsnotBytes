# test_agent1.py
import requests

payload = {
    "messages": [{"role": "user", "content": "Ping from Python client"}]
}

r = requests.post("http://localhost:7002/invoke", json=payload)
print("Status:", r.status_code)
print("Response:", r.json())