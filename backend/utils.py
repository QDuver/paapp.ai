import json


def process_output(output, model):
    output_data = json.loads(output)
    return model(**output_data)

