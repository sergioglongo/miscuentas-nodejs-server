# Use an official Node.js 22 base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if applicable) to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your application listens on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "run", "dev"]