from google import genai
from google.genai import types
import json
import os
from datetime import datetime

from config import is_local_environment, PROJECT


class Agent:
    def __init__(self):
        self.client = genai.Client( vertexai=True, project=PROJECT, location="us-central1" )
        self.output_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'outputs')
        os.makedirs(self.output_dir, exist_ok=True)

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

    def call(self, si, prompt, model, text_contexts=[], image_contexts=[], schema=None):
        contents = self._generate_content(prompt, text_contexts, image_contexts)
        response = self.client.models.generate_content(
            model=model,
            config=types.GenerateContentConfig( 
                system_instruction=si, 
                response_mime_type="application/json",
                response_schema=schema,
                max_output_tokens=8192
                ),
            contents=contents
        )
        
        # Auto-save the output
        self._save_output(si, prompt, response.text, text_contexts, image_contexts, model)
        
        return response.text

    def _save_output(self, system_instruction, prompt, output, text_contexts, image_contexts, model):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"llm_output_{timestamp}.json"
        filepath = os.path.join(self.output_dir, filename)
        
        data = {
            "timestamp": datetime.now().isoformat(),
            "model": model,
            "system_instruction": system_instruction,
            "prompt": prompt,
            "text_contexts": text_contexts,
            "image_contexts_count": len(image_contexts),
            "output": output
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

