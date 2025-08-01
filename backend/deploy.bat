@echo off
call gcloud builds submit --tag gcr.io/final-app-429707/life-automation-api
call gcloud run deploy life-automation-api --image gcr.io/final-app-429707/life-automation-api --platform managed --region europe-west2 --allow-unauthenticated
pause