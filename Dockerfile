FROM node:10 as build
WORKDIR /app
COPY package.json yarn.lock tsconfig.json .sequelizerc ./
RUN yarn install
COPY ./src ./src
COPY ./typings ./typings
COPY ./sequelize ./sequelize
RUN yarn build
RUN yarn install --prod


FROM node:10 AS release
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/.sequelizerc ./.sequelizerc
COPY --from=build /app/sequelize ./sequelize
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
RUN ls -la /app
RUN ls -la /app/dist

USER node

CMD [ "yarn", "start" ]
