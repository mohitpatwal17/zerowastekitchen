import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

class OpenAIClient:
    def __init__(self):
        self.has_key = bool(OPENAI_API_KEY)
        if self.has_key:
            base_url = os.environ.get("AI_BASE_URL")
            self.client = OpenAI(api_key=OPENAI_API_KEY, base_url=base_url)
        else:
            self.client = None
            print("WARNING: OPENAI_API_KEY is not set. Using mock fallbacks for AI engine.")
            
    def generate_content(self, prompt: str, system_instruction: str = None, response_schema=None) -> str:
        if not self.has_key:
            return None
            
        try:
            messages = []
            if system_instruction:
                messages.append({"role": "system", "content": system_instruction})
            messages.append({"role": "user", "content": prompt})
            
            # Using requested model or gpt-4o as fallback if gpt-oss-120b is invalid
            model = os.environ.get("AI_MODEL", "gpt-oss-120b")
            
            response = self.client.chat.completions.create(
                model=model,
                messages=messages
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI API Error: {e}")
            return None

ai_client = OpenAIClient()
