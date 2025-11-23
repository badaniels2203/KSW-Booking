# Nginx Static Site Dockerfile
# Usage: docker build -t my-nginx-app -f dockerfiles/nginx/Dockerfile .

FROM nginx:alpine

# Copy custom nginx configuration (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Copy static files
COPY ./public /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
