
from datetime import datetime
import json
import requests

from google.cloud import firestore
from config import CONFIG, PROJECT
from models.exercises import Exercises
from models.groceries import Groceries
from models.meals import Meal, Meals
from models.settings import Settings
from models.routines import Routines
from models.abstracts import FirestoreDoc

if __name__ == "__main__":

    CONFIG.USER_FS = firestore.Client(project=PROJECT, database='qd-umileigiudber2rbzjguipjfys23')

    Groceries().save()
    # Exercises().build_with_ai()
    # routines = Routines().query()
    # Routines().delete()
    # Exercises().save()
    # Settings().delete()
    # Settings().save()
    # Exercises().build_with_ai()
    # Meals().build_with_ai()
    # print(Routines())


    # headers = {"Authorization": "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImU4MWYwNTJhZWYwNDBhOTdjMzlkMjY1MzgxZGU2Y2I0MzRiYzM1ZjMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiUXVlbnRpbiBEdXZlcmfDqSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKOW5nUkxBeTlGSDFmdG9keHkzWWFUR0VrVURsSUlMNWZiZ3dSelhfN2R6d1hIcmtRSj1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9maW5hbC1hcHAtNDI5NzA3IiwiYXVkIjoiZmluYWwtYXBwLTQyOTcwNyIsImF1dGhfdGltZSI6MTc1OTMzMDAwOSwidXNlcl9pZCI6IlVNSUxlSWdpdURiRXIycmJ6SkdVSXBKZnlTMjMiLCJzdWIiOiJVTUlMZUlnaXVEYkVyMnJiekpHVUlwSmZ5UzIzIiwiaWF0IjoxNzU5NDY0NDk3LCJleHAiOjE3NTk0NjgwOTcsImVtYWlsIjoicXVlbnRpbi5kdXZlcmdlQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTA2MzEwNjQ1ODcxMjQzMjQ5MzA1Il0sImVtYWlsIjpbInF1ZW50aW4uZHV2ZXJnZUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.Cy3WbhxfzN6JRB_NvkM-2qgFpBV8pLVq5n6zDJr1YI4RX3w9KJu2F_aXl3Wn6Z1M-tks-o9S74cNGICywu5bSUFw6-6_5GWlR4NZQBVO6JnOPaIoy6iKTpA8NcJvgZuz1LV_wUYdo5C3mSpwTnBiNb_jbUo4tulsQCa5fHb5awk2WjUJ1EG5RbOh53GpDuhr0bxjpcNDKY-QN5rTGDOS_Gcuaow9p0yFTTVzGXz_T4sDP7BA9g-DF4FyzsU20hTiQvSi7wufP0XWkmDf93Nx3kA4ZJ5v1fGqOJaxBcGDXn9J-c7w-iRpUpLD0Eki7CACa8W5D4Ibbjma-TeYztPq4w"}
    # ex = requests.get("http://localhost:8000/unique/exercises", headers=headers)
    # ex = requests.post("http://localhost:8000/schedule/exercises/2025-10-25", json={})
    # print(ex.json())