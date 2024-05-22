# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.2.0

FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

ENV NODE_ENV="production"

# ca-certificates, curl, and gnupg are required to fetch and verify the yarn GPG
# key
RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y ca-certificates curl gnupg

# fetch and verify the yarn GPG key
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# install yarn
RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y yarn=1.22.19-1

# Copy pre-built application
COPY --link build /build
COPY package.json /package.json

RUN yarn install --frozen-lockfile

# This is the only way I could get ES modules to work. The behvior is defferent
# on my local (Mac OS). ES modules are the stuff of nightmares in Node.js
RUN mv /build/node-server/NodeServer.js /build/node-server/NodeServer.mjs

# Web server listens on port 4000
EXPOSE 4000
CMD ["node", "--conditions=react-server", "build/node-server/NodeServer.mjs", "--env=production"]
