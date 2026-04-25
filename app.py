from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

OPENROUTER_API_KEY = "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"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message")

    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
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
- List possible causes (3–5 max)
- Ask 2–3 follow-up questions
- Give urgency level: LOW / MEDIUM / HIGH
- Always recommend consulting a doctor
"""
            },
            {
                "role": "user",
                "content": user_input
            }
        ]
    }

    response = requests.post(url, headers=headers, json=data)
    res_json = response.json()

    try:
        reply = res_json["choices"][0]["message"]["content"]
    except:
        reply = "Error: " + str(res_json)

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)