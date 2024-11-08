# Stage 1: Build the application
FROM node:20-alpine as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Install tsup globally
RUN npm install -g tsup

# Copy package.json and package-lock.json
COPY package*.json ./
COPY tsconfig.json ./
COPY tsup.config.ts ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY src ./src

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy package.json and package-lock.json for production install
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev && \
    npm cache clean --force && \
    rm -rf ~/.npm

# Create a non-root user and switch to it
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /usr/src/app
USER nodejs

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD node -e "require('http').request('http://localhost:' + process.env.PORT + '/health-check', (r) => {if (r.statusCode !== 200) throw new Error()})"


# Start the app
CMD ["npm", "run", "start"]
