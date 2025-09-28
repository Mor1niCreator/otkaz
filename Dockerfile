FROM node:20-alpine AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund || true
COPY frontend ./
RUN npm run build || true

FROM python:3.11-slim AS backend
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y --no-install-recommends build-essential curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY app/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt
COPY app /app
COPY --from=frontend /frontend/dist /app/static
ENV PORT=8080
EXPOSE 8080
CMD [" python\, \-m\, \uvicorn\, \main:app\, \--host\, \0.0.0.0\, \--port\, \8080\]
