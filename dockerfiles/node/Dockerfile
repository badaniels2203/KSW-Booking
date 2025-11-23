# Node.js Application Dockerfile
# Usage: docker build -t my-node-app -f dockerfiles/node/Dockerfile .

FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (adjust as needed)
EXPOSE 3000

# Run the application
CMD ["node", "index.js"]
