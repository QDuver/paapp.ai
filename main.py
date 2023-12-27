
from openai import OpenAI
import os
import json
os.environ['OPENAI_API_KEY'] = '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'
client = OpenAI()


completion = client.chat.completions.create(
  model="gpt-4-1106-preview",
  messages=[
    {"role": "system", "content":'''
     In the response, provide a JSON, with such format : 
     {
         "meal_plan": [
                {'2021-01-28': {'lunch': 'Chicken Salad', 'dinner': 'Chicken Salad'}},
                {'2021-01-29': {'lunch': 'Chicken Salad', 'dinner': 'Chicken Salad'}},     
     ]
     },
        "ingredients": [
            "Chicken",
            "Salad"
        ]
    '''},
    {"role": "user", "content": '''
    Provide me with a meal plan for the week, starting from Dec 28th 2023.
     It should be only lunch and dinner, you can ignore the breakfast.
    I want to eat healthy.
    Also provide the list of ingredients I need to buy for the week.
    '''}
  ],
  response_format={ "type": "json_object" }
)

resp = completion.choices[0].message.content
print(resp)