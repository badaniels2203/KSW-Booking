# Python Application Dockerfile
# Usage: docker build -t my-python-app -f dockerfiles/python/Dockerfile .

FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (adjust as needed)
EXPOSE 8000

# Run the application
CMD ["python", "main.py"]
