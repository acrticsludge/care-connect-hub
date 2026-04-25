import os
import requests

url = "https://openrouter.ai/api/v1/chat/completions"

headers = {
    "Authorization": f"Bearer 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",
    "Content-Type": "application/json"
}

data = {
    "model": "deepseek/deepseek-chat",
    "messages": [
        {
            "role": "system",
            "content": """You are an AI symptom checker.

Rules:
- Do NOT give a definitive diagnosis
- List possible conditions (3–5 max)
- Ask 2–3 follow-up questions
- Give urgency level: LOW / MEDIUM / HIGH
- Always recommend consulting a doctor
- Highlight emergency symptoms clearly

Format your response like:

Possible Causes:
- ...

Urgency Level:
...

Follow-up Questions:
- ...

Advice:
...
"""
        },
        {
            "role": "user",
            "content": "Symptoms: chest pain, fatigue\nDuration: 2 days\nAge: 18\nOther conditions: none"
        }
    ]
}

response = requests.post(url, headers=headers, json=data)

res_json = response.json()
print(res_json["choices"][0]["message"]["content"])