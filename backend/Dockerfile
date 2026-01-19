FROM node:18-alpine

# Install wget for health checks
RUN apk add --no-cache wget

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create database directory
RUN mkdir -p database

# Expose port
EXPOSE 3001

# Initialize database and start server
CMD ["sh", "-c", "npm run init-db && npm start"]
