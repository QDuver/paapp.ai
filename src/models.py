from pydantic import BaseModel
from typing import Optional, Literal, Union
from datetime import time, datetime, timedelta
from enum import Enum


class RunningDistance(BaseModel):
    distance_km: float
    duration: time


class RunningIntervals(BaseModel):
    speed_km: float
    duration: time
    rest: time
    repetitions: int


class WorkOut(BaseModel):
    exercise: str
    weight_kg: Optional[float] = None
    repetitions: Optional[int] = None
    sets: Optional[int] = None
    distance_km: Optional[float] = None
    time_min: Optional[int] = None
    duration_sec: Optional[int] = None
    
class Exercises(BaseModel):
    exercises: list[WorkOut | RunningDistance | RunningIntervals] = []
    available_time_min: int

class Day(BaseModel):
    date: datetime = datetime.now()
    wakeup_time: time = None
    sleep_quality: int = None  # Scale from 1 to 10
    exercises: Exercises = None

