# OKX Screener (okx-screener)

OKX Screener is a tool for analyzing cryptocurrency trading pairs on the OKX exchange. It enables monitoring of market data such as price changes, trading volumes, and volatility, as well as calculating technical indicators, including ATR and Pivot Points. The screener helps traders quickly assess market conditions and make informed trading decisions.

## Run backend

1. Download and install [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Install [mongodb](https://www.mongodb.com/docs/manual/installation/) 
3. Install the dependencies using `npm install` command
4. Run backend using `node index.js` command

## Run frontend

1. Install the dependencies using `npm install` command
2. Run frontend in development mode using `npm run dev` command

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

## Deploy backend

1. Create App Service in Azure
2. zip backend
3. Run command `az webapp deployment source config-zip --resource-group okx-screener-rg  --name okx-screener-backend --src ./backend.zip`

## Deploy frontend

1. Create Static Web App resource in Azure resource group
2. Build frontend using `npm run build`
2. From `dist` folder run `swa deploy ./spa --env production --app-name okx-screener-frontend`
