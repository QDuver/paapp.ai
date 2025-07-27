from pydantic import BaseModel
from typing import Optional, Literal, Union
from datetime import time, datetime, timedelta
from enum import Enum


class RunningDistance(BaseModel):
    model_config = {"extra": "forbid"}
    distance_km: float
    duration: str


class RunningIntervals(BaseModel):
    model_config = {"extra": "forbid"}
    speed_km: float
    duration: str
    rest: str
    repetitions: int


class WorkOut(BaseModel):
    model_config = {"extra": "forbid"}
    name: str
    weight_kg: Optional[float] = None
    repetitions: Optional[int] = None
    sets: Optional[int] = None
    duration_sec: Optional[int] = None

class Day(BaseModel):
    model_config = {"extra": "forbid"}
    date: str = datetime.now().strftime("%Y-%m-%d")
    wakeup_time: Optional[str] = None
    sleep_quality: int = None  # Scale from 1 to 10
    available_exercise_time: Optional[int] = None
    exercises: list[WorkOut | RunningDistance | RunningIntervals] = []

