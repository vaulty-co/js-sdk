FROM node:current-alpine3.11

WORKDIR /app

COPY packages ./packages

COPY package.json yarn.lock ./

# Install production dependecies

RUN yarn install --frozen-lockfile --production

# Remove unused packages

RUN cd packages && ls -1 | grep -v "elements" | xargs rm -rf

# Start @vaulty/elements server

CMD cd packages/elements && yarn start

EXPOSE 3001
