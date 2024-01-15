# Stage 1: Build
FROM node:14 AS build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Runtime
FROM node:14-alpine

WORKDIR /usr/src/app

# Copy built assets from the build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules

# Expose port (e.g., 3000)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
