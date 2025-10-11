# Use an official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port for the development server
EXPOSE 3000

# Command to start the app
CMD ["npm", "start"]