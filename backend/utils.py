import json


def process_output(output, model):
    output_data = json.loads(output)
    if isinstance(output_data, list) and len(output_data) > 0:
        return model(**output_data[0])
    else:
        return model(**output_data)

