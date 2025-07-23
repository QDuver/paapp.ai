from google import genai
from google.genai import types


class Vertex:
    def __init__(self):
        self.client = client = genai.Client( vertexai=True, project="final-app-429707", location="us-central1" )
        self.model = "gemini-2.0-flash-lite-001"

    def generate_content(self, prompt, text_contexts=[], image_contexts=[]):
        contents = [prompt]
        for text in text_contexts:
            contents.append(types.Part.from_text(text=text))
        for image in image_contexts: 
            contents.append(types.Part.from_bytes(data=open(image, "rb").read(), mime_type="image/jpeg"),)

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
