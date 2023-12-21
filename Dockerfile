# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . /app/

# Expose the port used by the backend server
EXPOSE 8002

# Define the entry point for the container
CMD ["node", "index.js"]
