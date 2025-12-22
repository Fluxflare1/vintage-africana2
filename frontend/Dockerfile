FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Avoid peer-dependency install failures in container builds (common with eslint/next)
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]
