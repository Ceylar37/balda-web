#!/bin/sh
# Replace env vars in nginx.conf
envsubst '${API_URL}' < /nginx.conf.template > /etc/nginx/nginx.conf

# Start nginx
exec "$@"
