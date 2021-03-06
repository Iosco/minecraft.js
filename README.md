# MinecraftJS

MinecraftJS brings the best-selling PC game "Minecraft" into the web with the power of javascript.

# Motivation

Having to open an additional app to play a game is sometimes too tiring. Therefore, I thought it'd be interesting to somehow implement Minecraft with javascript, essentially bringing the whole Minecraft game into the web. This not only takes away the tedious process of installing the game, it also brings the entire game to players within a couple clicks.

# Screenshots

These are some screenshots taken directly from the project.

## User Authentication

![](https://i.imgur.com/1jwIc4x.jpg)

![](https://i.imgur.com/VKyEP2F.jpg)

![](https://i.imgur.com/GUyan19.jpg)

![](https://i.imgur.com/u52JZ3n.jpg)

## Neatly Styled Game UI

![](https://i.imgur.com/YoVA8P6.jpg)

![](https://i.imgur.com/du58Ifa.png)

## Awesome Graphics

![](https://i.imgur.com/v3aR0E7.png)

![](https://i.imgur.com/tEuhoBx.jpg)

![](https://i.imgur.com/5dadkka.jpg)

![](https://i.imgur.com/extPtZs.png)

# Build Stack

Javascript.

## Frontend

- [react.js](https://reactjs.org/)
- [react-router](https://github.com/ReactTraining/react-router)
- [apollo](https://www.apollographql.com/)

## Backend

- [prisma](https://www.prisma.io/docs/1.34/get-started/01-setting-up-prisma-new-database-TYPESCRIPT-t002/)
- [graphql-yoga](https://github.com/prisma/graphql-yoga)

## Authentication

- [bcryptjs](https://github.com/dcodeIO/bcrypt.js/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme)

# Features

- Player registration
- Save worlds
- Database support

# Installation

Before cloning the repo or doing anything, be sure to install [docker](https://www.docker.com/), [node](https://nodejs.org/en/), [prisma-cli](https://www.prisma.io/docs/prisma-cli-and-configuration/using-the-prisma-cli-alx4/) and [graphql-cli](https://github.com/graphql-cli/graphql-cli#install) on your computer. After that, run the following commands:

```bash
# Clone the repository
git clone https://github.com/ian13456/minecraft.js.git

# Download packages for both server and client
yarn

# Export environment variables for prisma
# FOR WINDOWS
set PRISMA_MANAGEMENT_API_SECRET=my-secret
# FOR MAC/LINUX (recommend putting this into .bashrc)
export PRISMA_MANAGEMENT_API_SECRET=my-secret

# Start all services
yarn run init # only need this for first time running
yarn run start
```

After these commands, visit `localhost:3000`

# Note

:pushpin: MinecraftJS runs fastest on either Opera or Chrome.

# Sources

- [Resource Pack Used](http://www.9minecraft.net/paper-cut-resource-pack/)
