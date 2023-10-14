# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

# Install app dependencies using `npm install`
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Build command
RUN npm run build

ENTRYPOINT ["/bin/sh", "-c", "npm run start:dev"]