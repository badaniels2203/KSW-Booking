# Golang Application Dockerfile (Multi-stage build)
# Usage: docker build -t my-go-app -f dockerfiles/golang/Dockerfile .

# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Build the application
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Runtime stage
FROM alpine:latest

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/main .

# Expose port (adjust as needed)
EXPOSE 8080

CMD ["./main"]
