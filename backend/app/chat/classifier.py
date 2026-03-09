import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def classify_prompt(prompt: str) -> str:

    classifier_prompt = f"""
You are a prompt complexity classifier.

Classify the user prompt into one of two categories:

SIMPLE:
- greetings
- basic questions
- definitions
- casual conversation
- short explanations

Examples:
Hello
What is Python?
Define AI

COMPLEX:
- multi-step reasoning
- architecture design
- debugging code
- research analysis
- long explanations

Examples:
Design a scalable microservices architecture
Analyze this code and find bugs
Explain quantum computing in depth

Return ONLY one word:
SIMPLE or COMPLEX

User Prompt:
{prompt}
"""

    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[
            {"role": "user", "content": classifier_prompt}
        ],
        temperature=0
    )

    result = response.choices[0].message.content.strip()

    return result


# Test
if __name__ == "__main__":
    user_prompt = input("Enter prompt: ")
    classification = classify_prompt(user_prompt)

    print("Prompt Type:", classification)
    