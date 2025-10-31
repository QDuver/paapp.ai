import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from datetime import datetime, timedelta
from functools import partial
from airflow import DAG
from airflow.operators.python import PythonOperator
import requests

DEFAULT_ARGS = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

def call_api(endpoint):
    headers = {}
    api_key = os.getenv('DAG_API_KEY')
    if api_key:
        headers['X-API-Key'] = api_key

    response = requests.get(
        f"https://life-automation-api-1050310982145.europe-west2.run.app/{endpoint}",
        headers=headers,
        timeout=300
    )
    response.raise_for_status()
    return response.json()

def create_dag(dag_id, description, schedule_interval, task_id, endpoint, tags=None):
    with DAG(
        dag_id,
        default_args=DEFAULT_ARGS,
        description=description,
        schedule_interval=schedule_interval,
        start_date=datetime(2025, 1, 1),
        catchup=False,
        tags=tags or ['life-automation'],
    ) as dag:

        PythonOperator(
            task_id=task_id,
            python_callable=partial(call_api, endpoint),
        )

    return dag  
