# mercadolivre-ofertas

<img src="https://camo.githubusercontent.com/4e084bac046962268fcf7a8aaf3d4ac422d3327564f9685c9d1b57aa56b142e9/68747470733a2f2f7472617669732d63692e6f72672f6477796c2f657374612e7376673f6272616e63683d6d6173746572" alt="Build Status" data-canonical-src="https://travis-ci.org/dwyl/esta.svg?branch=master" style="max-width: 100%;">

API developed using web scraping to show products offers from Mercado Livre: https://www.mercadolivre.com.br/ofertas
<br>
<b>An always up-to-date version is hosted at: https://mercadolivre-ofertas.herokuapp.com/</b>

## Stack

- Node.js 16.x (w/ yarn)
  - Express.js 4.x
  - Puppeteer 14.x
  - Node-cache 5.x
  - TypeScript 4.x

## Installation

Install packages:

```
yarn install
```

If you want to have the API running on a different port, change in `src/server.ts` to your preferred port.
<br>
Depending on if you want to install the API for production or for development, the process is different.

### Production

Build the project using the following command:

```
yarn build
```

Then start the server with this command:

```
yarn start
```

### Development

Watch the project's files and start dev server via the following command:

```
yarn dev
```

## License

Licensed under Open Software License v3.0
