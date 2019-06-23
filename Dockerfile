FROM node:11-alpine
RUN apk update && echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && apk add --no-cache chromium
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app
WORKDIR /app
COPY . ./
USER pptruser
EXPOSE 3000
CMD ["node", "./lib/express.js"]
#ENTRYPOINT ["node", "./lib/express.js"]
