from google import genai
from google.genai import types

from config import is_local_environment


class Agent:
    def __init__(self, model):
        self.client = genai.Client( vertexai=True, project="final-app-429707", location="us-central1" )
        self.model = model

    def _generate_content(self, prompt, text_contexts=[], image_contexts=[]):
        contents = [prompt]
        for text in text_contexts:
            contents.append(types.Part.from_text(text=text))
        for image in image_contexts: 
            contents.append(types.Part.from_bytes(data=open(image, "rb").read(), mime_type="image/jpeg"),)

        return contents
    

    def prompt(self, dict_):
        prompt = ''
        for key, value in dict_.items():
            if(value):
                prompt += f'## {key}\n{value}\n\n ---- \n\n'
        return prompt

    def call(self, si, prompt, text_contexts=[], image_contexts=[], schema=None):
        contents = self._generate_content(prompt, text_contexts, image_contexts)
        response = self.client.models.generate_content(
            model=self.model,
            config=types.GenerateContentConfig( 
                system_instruction=si, 
                response_mime_type="application/json",
                response_schema=schema,
                max_output_tokens=8192
                ),
            contents=contents
        )
        return response.text

