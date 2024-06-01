# Base image
FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the React app if integrated directly inside the Node.js project
# RUN npm run build --prefix client

# Expose port and start application
EXPOSE 5000
CMD ["node", "server.js"]
