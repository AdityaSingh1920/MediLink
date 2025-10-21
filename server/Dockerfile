FROM node:18

WORKDIR /server

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

RUN npm install

COPY . .

# Expose backend port
EXPOSE 5000

CMD [ "npm","run","dev" ]
