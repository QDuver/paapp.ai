from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.models import Variable
import requests
import logging

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}

def schedule_day(**context):
    api_base_url = Variable.get("BACKEND_API_URL", default_var="https://your-service.run.app")

    execution_date = context['ds']

    url = f"{api_base_url}/schedule/{execution_date}"

    logging.info(f"Calling API: {url}")

    try:
        response = requests.post(
            url,
            json={"notes": "Daily automated generation"},
            timeout=300
        )
        response.raise_for_status()

        result = response.json()
        logging.info(f"Successfully scheduled daily content (exercises, meals) for {result['scheduled']} users")
        logging.info(f"Response: {result}")

        return result

    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to schedule daily content: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            logging.error(f"Response status: {e.response.status_code}")
            logging.error(f"Response body: {e.response.text}")
        raise

with DAG(
    'scheduler',
    default_args=default_args,
    description='Generate daily content (exercises, meals) for all users at 1am',
    schedule_interval='0 1 * * *',
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=['life-automation', 'daily', 'scheduler'],
) as dag:

    schedule_task = PythonOperator(
        task_id='schedule_daily_content',
        python_callable=schedule_day,
        provide_context=True,
    )
