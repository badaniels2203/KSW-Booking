# Docker Repository

A collection of Dockerfiles and Docker Compose configurations for various applications.

## Structure

```
.
├── dockerfiles/
│   ├── python/      # Python application Dockerfile
│   ├── node/        # Node.js application Dockerfile
│   ├── nginx/       # Nginx static site Dockerfile
│   └── golang/      # Go application Dockerfile (multi-stage)
├── docker-compose.yml   # Example compose configuration
├── .dockerignore        # Files to exclude from Docker builds
└── README.md
```

## Quick Start

### Build a Single Image

```bash
# Python
docker build -t my-python-app -f dockerfiles/python/Dockerfile .

# Node.js
docker build -t my-node-app -f dockerfiles/node/Dockerfile .

# Nginx
docker build -t my-nginx-app -f dockerfiles/nginx/Dockerfile .

# Golang
docker build -t my-go-app -f dockerfiles/golang/Dockerfile .
```

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d python-app

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Available Dockerfiles

| Directory | Base Image | Use Case |
|-----------|------------|----------|
| `python/` | python:3.11-slim | Python applications |
| `node/` | node:20-alpine | Node.js applications |
| `nginx/` | nginx:alpine | Static websites |
| `golang/` | golang:1.21-alpine | Go applications (multi-stage) |

## Customization

1. Copy the relevant Dockerfile to your project
2. Modify as needed for your application
3. Update the `docker-compose.yml` if using compose

## Best Practices

- Use `.dockerignore` to exclude unnecessary files from builds
- Use multi-stage builds for compiled languages (see Go example)
- Pin specific versions for base images in production
- Never commit secrets or credentials to Dockerfiles
