FROM nginx:latest
COPY nginx/default.conf /etc/nginx/conf.d
# COPY web /usr/share/nginx/html
EXPOSE 80
