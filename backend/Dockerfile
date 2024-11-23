FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY prisma/schema.prisma ./prisma/

EXPOSE 8080

CMD ["npm", "run", "start:migrate:dev"]
