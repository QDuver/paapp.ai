import json


def json_to_model(output, model):
    output_data = json.loads(output)
    return model(**output_data)

