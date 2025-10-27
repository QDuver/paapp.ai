@echo off
call gcloud builds submit --tag gcr.io/final-app-429707/life-automation-api
call gcloud run deploy life-automation-api --image gcr.io/final-app-429707/life-automation-api --platform managed --region europe-west2 --allow-unauthenticated

echo.
echo Setting Composer variables...
call gcloud composer environments run aiapps --location europe-west2 variables set -- BACKEND_API_URL https://life-automation-api-1050310982145.europe-west2.run.app

echo.
echo Uploading DAGs to Composer...
call gcloud composer environments storage dags import --environment aiapps --location europe-west2 --source dags/scheduler.py
call gcloud composer environments storage dags import --environment aiapps --location europe-west2 --source dags/uniques.py

echo.
echo Deployment complete!
pause