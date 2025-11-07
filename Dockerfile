# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install patch-package globally to avoid postinstall issues
RUN npm install -g patch-package

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port for Vite dev server
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
