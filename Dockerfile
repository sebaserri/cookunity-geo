FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Build TypeScript
RUN npm run build

# Expose the app port
EXPOSE 8000

# Start the app
CMD [ "node", "dist/server.js" ]
