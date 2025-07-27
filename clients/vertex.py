from google import genai
from google.genai import types
import os
import json
from google.oauth2 import service_account


class Vertex:
    def __init__(self):
        # Set up service account authentication
        service_account_path = os.path.join(os.path.dirname(
            os.path.dirname(__file__)), 'service-account.json')

        # Set up authentication using environment variable approach
        if os.path.exists(service_account_path):
            os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = service_account_path
        elif not os.getenv('GOOGLE_APPLICATION_CREDENTIALS'):
            # If no service account file found, try to use default credentials
            print("Warning: No service account file found. Using default credentials.")

        # Initialize client (credentials will be picked up from environment)
        self.client = genai.Client(
            vertexai=True,
            project="final-app-429707",
            location="us-central1"
        )
        
        self.model = "gemini-2.0-flash-lite-001"

    def generate_content(self, prompt, text_contexts=[], image_contexts=[]):
        contents = [prompt]
        for text in text_contexts:
            contents.append(types.Part.from_text(text=text))
        for image in image_contexts:
            contents.append(types.Part.from_bytes(
                data=open(image, "rb").read(), mime_type="image/jpeg"),)

        return contents

    def call_agent(self, agent, prompt, text_contexts=[], image_contexts=[], schema=None):
        contents = self.generate_content(prompt, text_contexts, image_contexts)
        response = self.client.models.generate_content(
            model=self.model,
            config=types.GenerateContentConfig(
                system_instruction=agent,
                response_mime_type="application/json",
                response_schema=schema,
                max_output_tokens=8192
            ),
            contents=contents
        )
        return response.text

    def call(self, prompt, text_contexts=[], image_contexts=[]):
        contents = self.generate_content(prompt, text_contexts, image_contexts)
        response = self.client.models.generate_content(
            model=self.model,
            contents=contents
        )
        return response.text
