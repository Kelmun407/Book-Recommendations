# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the working directory
COPY . .

# Expose the port for the Express server
EXPOSE 3000

# Run the command to start the Express server
CMD ["start"]