#!/bin/sh

# npm install
cp .env ./apps/web/
cp .env ./apps/api/.env

npm run build
cp .env ./apps/api/dist/.env
# npm run serve
# Execute the passed command
exec "$@"