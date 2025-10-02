
from datetime import datetime
import json
import requests

from google.cloud import firestore
from config import CONFIG, PROJECT
from models.exercises import Exercises
from models.meals import Meal, Meals
from models.settings import Settings
from models.routines import Routines

if __name__ == "__main__":

    CONFIG.USER_FS = firestore.Client(project=PROJECT, database='qd-dmppbwh0rhvv5c9klckgpgrhvdm2')    
    # Exercises().build_with_ai()
    # routines = Routines().query()
    # Routines().delete()
    # Exercises().save()
    # Settings().delete()
    # Settings().save()
    # Exercises().build_with_ai()
    # Meals().build_with_ai()
    print(Routines())
    

    # headers = {"Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjA1NTc3MjZmYWIxMjMxZmEyZGNjNTcyMWExMDgzZGE2ODBjNGE3M2YiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoicXVlbnRpbiBkdXZlcmdlIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tqSHBLbUo3dkJsSTkzQjJOd3lMbWVvd1VBamQtZU5DLXA1SkRpYzRmXzM4V1VWUT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9maW5hbC1hcHAtNDI5NzA3IiwiYXVkIjoiZmluYWwtYXBwLTQyOTcwNyIsImF1dGhfdGltZSI6MTc1OTMzMDY2NSwidXNlcl9pZCI6ImRtcFBiV2gwUkhWVjVjOWtsQ2tncEdySFZEbTIiLCJzdWIiOiJkbXBQYldoMFJIVlY1YzlrbENrZ3BHckhWRG0yIiwiaWF0IjoxNzU5MzMwNjY1LCJleHAiOjE3NTkzMzQyNjUsImVtYWlsIjoidGltZWxpbmVzLmNvbnRhY3RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDEwNjAzMzY5MDI0NTExNjA5MTMiXSwiZW1haWwiOlsidGltZWxpbmVzLmNvbnRhY3RAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.CxauUovv9HYNNWH-AKNbR8Zob1nfh-RSE1SrMHRIJ7ylWyKWlb_eGEKif03RFklezkZAzyXhT7LW6igMvzZM-Xst2-SbgbtTD7UU-AZntDezh0kv0rBL0JJUi6jStPp2f-XTvQO9Xx1Z6ZA-FTGxdPVcP2cMKwiNn--OMXymvM2N5MQOeTjiyfl4RR4dda_P4BTcKtnmjQGfzJ7OQn1actIIUqPvnZqS75dIL64Z6ne4u5NyZCCHr4ZZtaRFDNPxSC28yI0qzgQcrDfeir7ScxgFq1ZGmnUSI318paUk-i3oPC3woQei1vIkOh5lAZcCGLPZ_w-BUiiYwuCq1SLuBg"}
    # ex = requests.get("http://localhost:8000/routines/2025-09-30", headers=headers)•