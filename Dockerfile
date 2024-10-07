FROM node:20-alpine

# Set timezone and environment variables
ENV PS1="\u@\h:\w\\$ "
ENV TZ="Asia/Jakarta"
ENV NODE_ENV=${NODE_ENV}

# Set the working directory
WORKDIR /opt

# Copy root-level files
COPY ./package.json ./turbo.json ./.env /opt/
# COPY ./package.json ./package-lock.json ./turbo.json ./.env /opt/

COPY ./apps /opt/apps
# Install root-level dependencies (if needed)
RUN npm install
# **Copy the custom entrypoint script into the container**
COPY ./docker-entrypoint.sh /usr/local/bin/
COPY ./docker-entrypoint.sh /usr/local/bin/
# Ensure permissions are set
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Use the entrypoint script to execute the app
ENTRYPOINT ["docker-entrypoint.sh"]
# RUN npm run build
CMD ["npm", "run", "serve"]
