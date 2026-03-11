# Sarah-Beth's Math Adventure
# Lightweight nginx container serving a static math-learning site
FROM nginx:alpine

# Remove default nginx content
RUN rm /etc/nginx/conf.d/default.conf && rm -rf /usr/share/nginx/html/*

# Custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/math-adventure.conf

# Website files
COPY index.html /usr/share/nginx/html/
COPY css/       /usr/share/nginx/html/css/
COPY js/        /usr/share/nginx/html/js/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO /dev/null http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
