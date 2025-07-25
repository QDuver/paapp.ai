from datetime import datetime, time
from models import Day, RunningDistance, WorkOut

database = [
    Day(
        date=datetime(2025, 7, 25).strftime("%Y-%m-%d"),
        sleep_quality=7,
        wakeup_time=time(6, 0).strftime("%H:%M")
    ),
    Day(
        date=datetime(2025, 7, 24).strftime("%Y-%m-%d"),
        sleep_quality=4,
        wakeup_time=time(7, 30).strftime("%H:%M")
    ),
    Day(
        date=datetime(2025, 7, 23).strftime("%Y-%m-%d"),
        sleep_quality=6,
        wakeup_time=time(7, 30).strftime("%H:%M"),
        available_exercise_time=25,
        exercises=[
            RunningDistance(distance_km=4.72, duration=time(0, 27, 54).strftime("%H:%M:%S")),
            WorkOut(name='Push Ups', repetitions=10, sets=3),
            WorkOut(name='Planks', duration_sec=60, sets=2),
        ],
    ),
    Day(
        date=datetime(2025, 7, 22).strftime("%Y-%m-%d"),
        sleep_quality=8,
        wakeup_time=time(7, 30).strftime("%H:%M"),
        available_exercise_time=60,
        exercises=[
            WorkOut(name='Biceps Curls', repetitions=12, sets=3, weight_kg=10),
            WorkOut(name='Bench Press', repetitions=5, sets=5, weight_kg=15),
            WorkOut(name='Lateral Raise', repetitions=7, sets=4, weight_kg=6),
        ],
    ),
]

