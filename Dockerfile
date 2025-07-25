# Use the official Python image.
FROM python:3.11-slim

# Allow statements and log messages to immediately appear in Cloud Run logs
ENV PYTHONUNBUFFERED True

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application code
COPY . .

# Expose port 8080
EXPOSE 8080

# Run the app with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]

# uvicorn main:app --reload --host 0.0.0.0 --port 8000
# gcloud builds submit --tag gcr.io/final-app-429707/openintro-linkedin-fetch && gcloud run deploy openintro-linkedin-fetch     --image gcr.io/final-app-429707/openintro-linkedin-fetch     --platform managed     --region europe-west2     --allow-unauthenticated