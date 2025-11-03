FROM node:20-slim
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build the Next.js app
COPY . .
RUN npm run build

# Run Next.js production server
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]
