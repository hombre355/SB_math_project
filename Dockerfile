# Sarah-Beth's Math Adventure
# Lightweight nginx container serving a static math-learning site
FROM nginx:alpine

# Install curl for healthcheck and remove default nginx content
RUN apk add --no-cache curl && \
    rm /etc/nginx/conf.d/default.conf && rm -rf /usr/share/nginx/html/*

# Custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/math-adventure.conf

# Website files
COPY index.html /usr/share/nginx/html/
COPY css/       /usr/share/nginx/html/css/
COPY js/        /usr/share/nginx/html/js/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
