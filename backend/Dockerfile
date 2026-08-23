# Use the official Node.js 18 image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Express Mode will map to this port
EXPOSE 8080

# Start the server
CMD [ "npm", "start" ]