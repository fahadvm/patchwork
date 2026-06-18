FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Copy migration files so they're available at runtime
RUN mkdir -p dist/database/migrations && \
    cp -r src/database/migrations/* dist/database/migrations/

EXPOSE 3001

CMD ["sh", "-c", "node dist/database/migrate && npm run start:prod"]
