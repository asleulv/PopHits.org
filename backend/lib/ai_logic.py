import os
from openai import OpenAI
from dotenv import load_dotenv

# 1. Load your .env file
load_dotenv()

# 2. Initialize the Client
# This will automatically look for 'OPENAI_KEY' in your .env
client = OpenAI(api_key=os.getenv("OPENAI_KEY"))

def get_regex_from_ai(user_prompt):
    system_msg = (
        "You are a Regex Expert. Your goal is to provide a Python/PostgreSQL compatible "
        "regex pattern based on the user's description of song titles. "
        "Requirements:\n"
        "1. Return ONLY the raw regex string.\n"
        "2. Do not include quotes, markdown, or explanations.\n"
        "3. Use word boundaries (\\b) to ensure you don't match parts of words."
    )
    
    try:
        # NEW SYNTAX for OpenAI v1.0+
        response = client.chat.completions.create(
            model="gpt-4o", 
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": f"Create a regex for: {user_prompt}"}
            ]
        )
        # Accessing content is also slightly different now:
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error talking to OpenAI: {e}")
        return None