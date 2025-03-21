# CoinMarketCap MCP

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) implementation for the [CoinMarketCap](https://coinmarketcap.com/) API, providing a standardized interface for accessing cryptocurrency market data, exchange information, and other blockchain-related metrics.

## Features

- Complete coverage of the CoinMarketCap API
- Fetch data on the latest crypto trends, market movements, and global market metrics
- Access to detailed OHLCV data with Standard subscription or higher
- Type-safe parameter validation with [Zod](https://zod.dev/)

## Installation

1. If you don't have an API key, sign up to receive a free `Basic` key [here](https://pro.coinmarketcap.com/signup/?plan=0).

2. Download the repo:
```bash
git clone https://github.com/shinzo-labs/coinmarketcap-mcp.git
```

3. Add the following to your `claude_desktop_config.json`:
```javascript
{
  "mcpServers": {
    "coinmarketcap": {
      "command": "node",
      "args": [
        "/path/to/coinmarketcap-mcp/index.js"
      ],
      "env": {
        "COINMARKETCAP_API_KEY": "your-key-here",
        "SUBSCRIPTION_LEVEL": "Basic" // "Basic", "Hobbyist", "Startup", "Standard", "Professional", or "Enterprise"
      }
    }
  }
}
```

## Supported Endpoints

### Subscription Level: Basic (and above)

#### Cryptocurrency
- `cryptoCurrencyMap`: Get mapping of all cryptocurrencies
- `getCryptoMetadata`: Get metadata for one or more cryptocurrencies
- `allCryptocurrencyListings`: Get latest market quote for 1-5000 cryptocurrencies
- `cryptoQuotesLatest`: Get latest market quote for 1 or more cryptocurrencies
- `cryptoCategories`: Get list of all cryptocurrency categories
- `cryptoCategory`: Get metadata about a cryptocurrency category

#### Exchange
- `exchangeMap`: Get mapping of all exchanges
- `exchangeInfo`: Get metadata for one or more exchanges
- `exchangeAssets`: Get list of all assets available on an exchange

#### DEX
- `dexInfo`: Get metadata for one or more decentralised exchanges
- `dexListingsLatest`: Get latest market data for all DEXes
- `dexNetworksList`: Get list of all networks with unique IDs
- `dexSpotPairsLatest`: Get latest market data for all active DEX spot pairs
- `dexPairsQuotesLatest`: Get latest market quotes for spot pairs
- `dexPairsOhlcvLatest`: Get latest OHLCV data for spot pairs
- `dexPairsOhlcvHistorical`: Get historical OHLCV data for spot pairs
- `dexPairsTradeLatest`: Get latest trades for spot pairs

#### Global Metrics
- `globalMetricsLatest`: Get latest global cryptocurrency metrics

#### Index
- `cmc100IndexLatest`: Get latest CoinMarketCap 100 Index value and constituents
- `cmc100IndexHistorical`: Get historical CoinMarketCap 100 Index values

#### Tools
- `priceConversion`: Convert an amount of one cryptocurrency or fiat currency into another
- `getPostmanCollection`: Get Postman collection for the API

#### Other
- `fiatMap`: Get mapping of all fiat currencies
- `keyInfo`: Get API key usage and status
- `fearAndGreedLatest`: Get latest Fear & Greed Index
- `fearAndGreedHistorical`: Get historical Fear & Greed Index values

### Subscription Level: Hobbyist (and above)

#### Cryptocurrency
- `cryptoAirdrops`: Get list of all cryptocurrency airdrops
- `cryptoAirdrop`: Get metadata about a specific airdrop
- `historicalCryptocurrencyListings`: Get historical market quotes for any cryptocurrency
- `cryptoQuotesHistorical`: Get historical market quotes for any cryptocurrency
- `cryptoQuotesHistoricalV3`: Get historical market quotes with advanced time-based intervals

#### Exchange
- `exchangeQuotesHistorical`: Get historical quotes for any exchange

#### Global Metrics
- `globalMetricsHistorical`: Get historical global cryptocurrency metrics

### Subscription Level: Startup (and above)

#### Cryptocurrency
- `newCryptocurrencyListings`: Get list of most recently added cryptocurrencies
- `cryptoTrendingGainersLosers`: Get biggest gainers and losers in a given time period
- `cryptoTrendingLatest`: Get top cryptocurrencies by search volume
- `cryptoTrendingMostVisited`: Get most visited cryptocurrencies
- `cryptoOhlcvLatest`: Get latest OHLCV market data for any cryptocurrency
- `cryptoOhlcvHistorical`: Get historical OHLCV market data for any cryptocurrency
- `cryptoPricePerformanceStatsLatest`: Get price performance statistics for any cryptocurrency

### Subscription Level: Standard (and above)

#### Cryptocurrency
- `cryptoMarketPairsLatest`: Get latest market pairs for any cryptocurrency

#### Exchange
- `exchangeListingsLatest`: Get latest market data for all exchanges
- `exchangeMarketPairsLatest`: Get latest market pairs for any exchange
- `exchangeQuotesLatest`: Get latest market quotes for one or more exchanges

#### Content
- `contentLatest`: Get latest cryptocurrency news and content
- `contentPostsTop`: Get top cryptocurrency posts
- `contentPostsLatest`: Get latest cryptocurrency posts
- `contentPostsComments`: Get comments for a specific post

#### Community
- `communityTrendingTopic`: Get trending topics in the cryptocurrency community
- `communityTrendingToken`: Get trending tokens in the cryptocurrency community

### Subscription Level: Enterprise (and above)

#### Blockchain
- `blockchainStatisticsLatest`: Get latest statistics for one or more blockchains

## Contributing

Contributions are welcomed and encouraged. Contact austin@shinzolabs.com with any questions, comments or concerns.
