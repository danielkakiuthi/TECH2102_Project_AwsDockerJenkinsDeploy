FROM node

WORKDIR /code

COPY package.json ./

RUN npm install

COPY ./src ./src
COPY server.js .

EXPOSE 3000

# Create an anonmous node_modules folder that won't be reflected 
VOLUME ["/code/node_modules"]

CMD ["node", "server.js"]