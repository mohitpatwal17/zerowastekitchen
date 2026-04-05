import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

class GeminiAIClient:
    def __init__(self):
        self.has_key = bool(GEMINI_API_KEY)
        if self.has_key:
            self.client = genai.Client(api_key=GEMINI_API_KEY)
        else:
            self.client = None
            print("WARNING: GEMINI_API_KEY is not set. Using mock fallbacks for AI engine.")
            
    def generate_content(self, prompt: str, system_instruction: str = None, response_schema=None) -> str:
        if not self.has_key:
            return None
            
        try:
            config = {}
            if system_instruction:
                config["system_instruction"] = system_instruction
            if response_schema:
                config["response_mime_type"] = "application/json"
                config["response_schema"] = response_schema
                
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=config
            )
            return response.text
        except Exception as e:
            print(f"Gemini API Error: {e}")
            return None

gemini_client = GeminiAIClient()
