from common import create_dag

dag = create_dag(
    dag_id='delete_incomplete',
    description='Remove incomplete items from past dates (excludes today)',
    schedule_interval='0 1 * * *',
    task_id='delete_incomplete_items',
    endpoint='/delete-incomplete',
    tags=['life-automation', 'daily', 'cleanup'],
)
