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
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8080"]
