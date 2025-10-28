from common import create_dag

dag = create_dag(
    dag_id='uniques',
    description='Sync unique items from all collections to settings for all users',
    schedule_interval='0 2 * * *',
    task_id='uniques',
    endpoint='/uniques',
    tags=['life-automation', 'daily', 'sync'],
)


