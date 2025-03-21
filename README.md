# CoinMarketCap MCP

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) implementation for the [CoinMarketCap](https://coinmarketcap.com/) API, providing a standardized interface for accessing cryptocurrency market data, exchange information, and other blockchain-related metrics.

## Features

- Complete coverage of the CoinMarketCap API
- Subscription-based tool registration
- Type-safe parameter validation using [Zod](https://zod.dev/)

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
- `cryptoTrendingLatest`: Get trending cryptocurrencies
- `cryptoTrendingMostVisited`: Get most visited cryptocurrencies
- `cryptoTrendingGainersLosers`: Get top gainers and losers

#### Exchange
- `exchangeMap`: Get mapping of all exchanges
- `exchangeInfo`: Get metadata for one or more exchanges
- `exchangeListingsLatest`: Get latest market quote for 1-100 exchanges
- `exchangeQuotesLatest`: Get latest market quote for 1 or more exchanges

#### Global Metrics
- `globalMetricsLatest`: Get latest global cryptocurrency metrics

#### Tools
- `priceConversion`: Convert an amount of one cryptocurrency or fiat currency into another
- `getPostmanCollection`: Get Postman collection for the API

#### Other
- `fiatMap`: Get mapping of all fiat currencies
- `keyInfo`: Get API key usage and status
- `fearAndGreedLatest`: Get latest Fear & Greed Index

### Subscription Level: Hobbyist (and above)

#### Cryptocurrency
- `cryptoAirdrops`: Get list of all cryptocurrency airdrops
- `cryptoAirdrop`: Get metadata about a specific airdrop

#### Content
- `contentLatest`: Get latest cryptocurrency news and content
- `contentPostsTop`: Get top cryptocurrency posts
- `contentPostsLatest`: Get latest cryptocurrency posts
- `contentPostsComments`: Get comments for a specific post

#### Community
- `communityTrendingTopic`: Get trending topics in the cryptocurrency community
- `communityTrendingToken`: Get trending tokens in the cryptocurrency community

### Subscription Level: Standard (and above)

#### Cryptocurrency
- `historicalCryptocurrencyListings`: Get historical market quotes for any cryptocurrency
- `cryptoQuotesHistorical`: Get historical market quotes for any cryptocurrency
- `cryptoMarketPairsLatest`: Get latest market pairs for any cryptocurrency
- `cryptoOhlcvLatest`: Get latest OHLCV market data for any cryptocurrency
- `cryptoOhlcvHistorical`: Get historical OHLCV market data for any cryptocurrency
- `cryptoPricePerformanceStatsLatest`: Get price performance statistics for any cryptocurrency

#### Exchange
- `exchangeMarketPairsLatest`: Get latest market pairs for any exchange
- `exchangeAssets`: Get list of all assets (currencies, commodities, and indexes) available on an exchange

#### Global Metrics
- `globalMetricsHistorical`: Get historical global cryptocurrency metrics

#### Other
- `fearAndGreedHistorical`: Get historical Fear & Greed Index data
- `blockchainStatisticsLatest`: Get latest blockchain statistics

## Response Format

All responses follow the MCP content format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "JSON stringified response data"
    }
  ]
}
```

## Error Handling

Errors are returned in a consistent format:

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"error\": \"Error message\", \"status\": 403}"
    }
  ]
}
```

## Contributing

Contributions are welcomed and encouraged. Contact austin@shinzolabs.com with any questions, comments or concerns.
