FROM node:18
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install -g npm@10.8.1
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]