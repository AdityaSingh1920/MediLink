FROM node:18

WORKDIR /server

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

RUN npm install




COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose backend port
# EXPOSE 5000

# Expose port for Koyeb
EXPOSE 8080

CMD ["node", "index.js"]
