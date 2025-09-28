FROM python:3.11-slim

# Install Node.js for frontend build
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy frontend source and build
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Copy backend requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY app/ ./app/
COPY alembic/ ./alembic/
COPY alembic.ini .

# Create data directory
RUN mkdir -p /data

# Expose port
EXPOSE 8080

# Run migrations and start server
CMD ["sh", "-c", "cd /app && alembic upgrade head && python -m uvicorn app.main:app --host 0.0.0.0 --port 8080"]