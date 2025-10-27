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

def sync_unique_items(**context):
    api_base_url = Variable.get("BACKEND_API_URL", default_var="https://your-service.run.app")

    url = f"{api_base_url}/sync-uniques"

    logging.info(f"Calling API: {url}")

    try:
        response = requests.post(url, json={}, timeout=300)
        response.raise_for_status()

        result = response.json()
        logging.info(f"Successfully synced unique items for {result['synced']} databases")
        logging.info(f"Response: {result}")

        return result

    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to sync unique items: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            logging.error(f"Response status: {e.response.status_code}")
            logging.error(f"Response body: {e.response.text}")
        raise

with DAG(
    'sync_uniques',
    default_args=default_args,
    description='Sync unique items from all collections to settings for all users',
    schedule_interval='0 2 * * *',
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=['life-automation', 'daily', 'sync'],
) as dag:

    sync_task = PythonOperator(
        task_id='sync_unique_items',
        python_callable=sync_unique_items,
        provide_context=True,
    )


