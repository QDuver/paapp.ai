from common import create_dag


dag = create_dag(
    dag_id='scheduler',
    description='Generate daily content (exercises, meals) for all users at 1am',
    schedule_interval='0 2 * * *',
    task_id='schedule_daily_content',
    endpoint='/schedule',
    tags=['life-automation', 'daily', 'scheduler'],
)
