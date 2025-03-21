#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

const server = new McpServer({
  name: "CoinMarketCap-MCP",
  version: "1.1.0",
  description: "A complete MCP for the CoinMarketCap API"
})

// Subscription plan levels in order of increasing access
const SUBSCRIPTION_LEVELS = {
  "Basic": 0,
  "Hobbyist": 1,
  "Startup": 2,
  "Standard": 3,
  "Professional": 4,
  "Enterprise": 5
}

// Enhanced response formatter with status code support
function formatErrorResponse(message, status = 403) {
  return {
    content: [{
      type: "text",
      text: JSON.stringify({ error: message, status })
    }]
  }
}

// Helper function to format successful API responses
function formatResponse(data) {
  return {
    content: [{
      type: "text",
      text: JSON.stringify(data)
    }]
  }
}

// Enhanced API request wrapper with error handling
async function makeApiRequestWithErrorHandling(endpoint, params = {}) {
  try {
    const data = await makeApiRequest(endpoint, params)
    return formatResponse(data)
  } catch (error) {
    return formatErrorResponse(`Error fetching data from CoinMarketCap: ${error.message}`, 500)
  }
}

// Helper function for making API requests to CoinMarketCap
async function makeApiRequest(endpoint, params = {}) {
  const apiKey = process.env.COINMARKETCAP_API_KEY
  if (!apiKey) {
    throw new Error("COINMARKETCAP_API_KEY environment variable is not set")
  }
  
  // Build query parameters
  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, value.toString())
    }
  })
  
  const url = `https://pro-api.coinmarketcap.com${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-CMC_PRO_API_KEY': apiKey,
    }
  })
  
  if (!response.ok) {
    throw new Error(`Error fetching data from CoinMarketCap: ${response.statusText}`)
  }
  
  return await response.json()
}

// Helper function to check subscription level at runtime
function checkSubscriptionLevel(requiredLevel) {
  const currentLevel = SUBSCRIPTION_LEVELS[process.env.SUBSCRIPTION_LEVEL || 'Basic']
  return currentLevel >= requiredLevel
}

// Wrapper function to handle common endpoint patterns
async function handleEndpoint(apiCall) {
  try {
    return await apiCall()
  } catch (error) {
    return formatErrorResponse(error.message, error.status || 403)
  }
}

/*
 * BASIC SUBSCRIPTION ENDPOINTS
 */
if (checkSubscriptionLevel(SUBSCRIPTION_LEVELS.Basic)) {
  // /cryptocurrency/map
  server.tool("cryptoCurrencyMap",
    "Returns a mapping of all cryptocurrencies to unique CoinMarketCap IDs.",
    {
      listing_status: z.string().optional(),
      start: z.number().optional(),
      limit: z.number().optional(),
      sort: z.string().optional(),
      symbol: z.string().optional(),
      aux: z.string().optional()
    },
    async ({ listing_status = 'active', start = 1, limit = 100, sort = 'id', symbol, aux }) => {
      return handleEndpoint(async () => {
        return await makeApiRequestWithErrorHandling('/v1/cryptocurrency/map', {
          listing_status,
          start,
          limit,
          sort,
          symbol,
          aux
        })
      })
    }
  )

  // /cryptocurrency/info
  server.tool("getCryptoMetadata",
    "Returns all static metadata for one or more cryptocurrencies including logo, description, and website URLs.",
    {
      symbol: z.string().optional(),
      id: z.string().optional(),
      slug: z.string().optional(),
      address: z.string().optional(),
      aux: z.string().optional(),
      skip_invalid: z.boolean().optional()
    },
    async ({ symbol, id, slug, address, aux, skip_invalid }) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v2/cryptocurrency/info', {
          symbol,
          id,
          slug,
          address,
          aux,
          skip_invalid
        })
        return formatResponse(data)
      })
    }
  )

  // /cryptocurrency/listings/latest
  server.tool("allCryptocurrencyListings",
    "Returns a paginated list of all active cryptocurrencies with latest market data.",
    {
      start: z.number().optional(),
      limit: z.number().min(1).max(5000).optional(),
      price_min: z.number().optional(),
      price_max: z.number().optional(),
      market_cap_min: z.number().optional(),
      market_cap_max: z.number().optional(),
      volume_24h_min: z.number().optional(),
      volume_24h_max: z.number().optional(),
      circulating_supply_min: z.number().optional(),
      circulating_supply_max: z.number().optional(),
      percent_change_24h_min: z.number().optional(),
      percent_change_24h_max: z.number().optional(),
      convert: z.string().optional(),
      convert_id: z.string().optional(),
      sort: z.enum(['market_cap', 'name', 'symbol', 'date_added', 'price', 'circulating_supply', 'total_supply', 'max_supply', 'num_market_pairs', 'volume_24h', 'percent_change_1h', 'percent_change_24h', 'percent_change_7d']).optional(),
      sort_dir: z.enum(['asc', 'desc']).optional(),
      cryptocurrency_type: z.string().optional(),
      tag: z.string().optional(),
      aux: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/cryptocurrency/listings/latest', params)
        return formatResponse(data)
      })
    }
  )

  // /cryptocurrency/quotes/latest
  server.tool("cryptoQuotesLatest",
    "Returns the latest market quote for one or more cryptocurrencies.",
    {
      id: z.string().optional(),
      slug: z.string().optional(),
      symbol: z.string().optional(),
      convert: z.string().optional(),
      convert_id: z.string().optional(),
      aux: z.string().optional(),
      skip_invalid: z.boolean().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v2/cryptocurrency/quotes/latest', params)
        return formatResponse(data)
      })
    }
  )

  // /cryptocurrency/categories
  server.tool("cryptoCategories",
    "Returns information about all coin categories available on CoinMarketCap.",
    {
      start: z.number().optional(),
      limit: z.number().optional(),
      id: z.string().optional(),
      slug: z.string().optional(),
      symbol: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/cryptocurrency/categories', params)
        return formatResponse(data)
      })
    }
  )

  // /cryptocurrency/category
  server.tool("cryptoCategory",
    "Returns information about a single coin category on CoinMarketCap.",
    {
      id: z.string(),
      start: z.number().optional(),
      limit: z.number().optional(),
      convert: z.string().optional(),
      convert_id: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/cryptocurrency/category', params)
        return formatResponse(data)
      })
    }
  )

  // /cryptocurrency/trending/latest
  server.tool("cryptoTrendingLatest",
    "Returns the top cryptocurrencies by search volume in a given time period.",
    {
      time_period: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/cryptocurrency/trending/latest', params)
        return formatResponse(data)
      })
    }
  )

  // /cryptocurrency/trending/most-visited
  server.tool("cryptoTrendingMostVisited",
    "Returns the most visited cryptocurrencies on CoinMarketCap in a given time period.",
    {
      time_period: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/cryptocurrency/trending/most-visited', params)
        return formatResponse(data)
      })
    }
  )

  // /cryptocurrency/trending/gainers-losers
  server.tool("cryptoTrendingGainersLosers",
    "Returns the biggest gainers and losers in a given time period.",
    {
      time_period: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/cryptocurrency/trending/gainers-losers', params)
        return formatResponse(data)
      })
    }
  )

  // /exchange/map
  server.tool("exchangeMap",
    "Returns a mapping of all exchanges to unique CoinMarketCap IDs.",
    {
      listing_status: z.string().optional(),
      slug: z.string().optional(),
      start: z.number().optional(),
      limit: z.number().optional(),
      sort: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/exchange/map', params)
        return formatResponse(data)
      })
    }
  )

  // /exchange/info
  server.tool("exchangeInfo",
    "Returns metadata for one or more exchanges.",
    {
      id: z.string().optional(),
      slug: z.string().optional(),
      aux: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/exchange/info', params)
        return formatResponse(data)
      })
    }
  )

  // /exchange/listings/latest
  server.tool("exchangeListingsLatest",
    "Returns a paginated list of all exchanges with latest market data.",
    {
      start: z.number().optional(),
      limit: z.number().optional(),
      sort: z.string().optional(),
      sort_dir: z.string().optional(),
      convert: z.string().optional(),
      convert_id: z.string().optional(),
      aux: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/exchange/listings/latest', params)
        return formatResponse(data)
      })
    }
  )

  // /exchange/quotes/latest
  server.tool("exchangeQuotesLatest",
    "Returns the latest market quotes for one or more exchanges.",
    {
      id: z.string().optional(),
      slug: z.string().optional(),
      convert: z.string().optional(),
      convert_id: z.string().optional(),
      aux: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/exchange/quotes/latest', params)
        return formatResponse(data)
      })
    }
  )

  // /global-metrics/quotes/latest
  server.tool("globalMetricsLatest",
    "Returns the latest global cryptocurrency market metrics.",
    {
      convert: z.string().optional(),
      convert_id: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/global-metrics/quotes/latest', params)
        return formatResponse(data)
      })
    }
  )

  // /tools/price-conversion
  server.tool("priceConversion",
    "Convert an amount of one cryptocurrency or fiat currency into one or more different currencies.",
    {
      amount: z.number(),
      id: z.string().optional(),
      symbol: z.string().optional(),
      time: z.string().optional(),
      convert: z.string().optional(),
      convert_id: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v2/tools/price-conversion', params)
        return formatResponse(data)
      })
    }
  )

  // /tools/postman
  server.tool("getPostmanCollection",
    "Returns a Postman collection for the CoinMarketCap API.",
    {},
    async () => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/tools/postman')
        return formatResponse(data)
      })
    }
  )

  // /fiat/map
  server.tool("fiatMap",
    "Returns a mapping of all supported fiat currencies to unique CoinMarketCap IDs.",
    {
      start: z.number().optional(),
      limit: z.number().optional(),
      sort: z.string().optional(),
      include_metals: z.boolean().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/fiat/map', params)
        return formatResponse(data)
      })
    }
  )

  // /key/info
  server.tool("keyInfo",
    "Returns API key details and usage stats.",
    {},
    async () => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/key/info')
        return formatResponse(data)
      })
    }
  )

  // /fear-and-greed/latest
  server.tool("fearAndGreedLatest",
    "Returns the latest CMC Crypto Fear and Greed Index value.",
    {},
    async () => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/fear-and-greed/latest')
        return formatResponse(data)
      })
    }
  )
}

/*
 * HOBBYIST SUBSCRIPTION ENDPOINTS
 */
if (checkSubscriptionLevel(SUBSCRIPTION_LEVELS.Hobbyist)) {
  // /cryptocurrency/airdrops
  server.tool("cryptoAirdrops",
    "Returns a list of past, present, or future airdrops on CoinMarketCap.",
    {
      start: z.number().optional(),
      limit: z.number().optional(),
      status: z.string().optional(),
      id: z.string().optional(),
      slug: z.string().optional(),
      symbol: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/cryptocurrency/airdrops', params)
        return formatResponse(data)
      })
    }
  )

  // /cryptocurrency/airdrop
  server.tool("cryptoAirdrop",
    "Returns information about a single airdrop on CoinMarketCap.",
    {
      id: z.string()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/cryptocurrency/airdrop', params)
        return formatResponse(data)
      })
    }
  )

  // /content/latest
  server.tool("contentLatest",
    "Returns latest cryptocurrency news and Alexandria articles.",
    {
      start: z.number().optional(),
      limit: z.number().optional(),
      id: z.string().optional(),
      slug: z.string().optional(),
      symbol: z.string().optional(),
      news_type: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/content/latest', params)
        return formatResponse(data)
      })
    }
  )

  // /content/posts/top
  server.tool("contentPostsTop",
    "Returns top cryptocurrency posts.",
    {
      start: z.number().optional(),
      limit: z.number().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/content/posts/top', params)
        return formatResponse(data)
      })
    }
  )

  // /content/posts/latest
  server.tool("contentPostsLatest",
    "Returns latest cryptocurrency posts.",
    {
      start: z.number().optional(),
      limit: z.number().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/content/posts/latest', params)
        return formatResponse(data)
      })
    }
  )

  // /content/posts/comments
  server.tool("contentPostsComments",
    "Returns comments for a specific post.",
    {
      id: z.string(),
      start: z.number().optional(),
      limit: z.number().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/content/posts/comments', params)
        return formatResponse(data)
      })
    }
  )

  // /community/trending/topic
  server.tool("communityTrendingTopic",
    "Returns community trending topics.",
    {
      start: z.number().optional(),
      limit: z.number().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/community/trending/topic', params)
        return formatResponse(data)
      })
    }
  )

  // /community/trending/token
  server.tool("communityTrendingToken",
    "Returns community trending tokens.",
    {
      start: z.number().optional(),
      limit: z.number().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/community/trending/token', params)
        return formatResponse(data)
      })
    }
  )
}

/*
 * STANDARD SUBSCRIPTION ENDPOINTS
 */
if (checkSubscriptionLevel(SUBSCRIPTION_LEVELS.Standard)) {
  // /cryptocurrency/listings/historical
  server.tool("historicalCryptocurrencyListings",
    "Returns a ranked and sorted list of all cryptocurrencies for a historical point in time.",
    {
      timestamp: z.string().or(z.number()).optional(),
      start: z.number().optional(),
      limit: z.number().optional(),
      convert: z.string().optional(),
      convert_id: z.string().optional(),
      sort: z.string().optional(),
      sort_dir: z.string().optional(),
      cryptocurrency_type: z.string().optional(),
      aux: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/cryptocurrency/listings/historical', params)
        return formatResponse(data)
      })
    }
  )

  // /cryptocurrency/quotes/historical
  server.tool("cryptoQuotesHistorical",
    "Returns an interval of historical market quotes for any cryptocurrency.",
    {
      id: z.string().optional(),
      slug: z.string().optional(),
      symbol: z.string().optional(),
      time_start: z.string().optional(),
      time_end: z.string().optional(),
      count: z.number().optional(),
      interval: z.string().optional(),
      convert: z.string().optional(),
      convert_id: z.string().optional(),
      aux: z.string().optional(),
      skip_invalid: z.boolean().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v2/cryptocurrency/quotes/historical', params)
        return formatResponse(data)
      })
    }
  )

  // /cryptocurrency/market-pairs/latest
  server.tool("cryptoMarketPairsLatest",
    "Returns all market pairs for the specified cryptocurrency with associated stats.",
    {
      id: z.string().optional(),
      slug: z.string().optional(),
      symbol: z.string().optional(),
      start: z.number().optional(),
      limit: z.number().optional(),
      convert: z.string().optional(),
      convert_id: z.string().optional(),
      matched_id: z.string().optional(),
      matched_symbol: z.string().optional(),
      category: z.string().optional(),
      fee_type: z.string().optional(),
      aux: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v2/cryptocurrency/market-pairs/latest', params)
        return formatResponse(data)
      })
    }
  )

  // /cryptocurrency/ohlcv/latest
  server.tool("cryptoOhlcvLatest",
    "Returns the latest OHLCV (Open, High, Low, Close, Volume) market values for one or more cryptocurrencies.",
    {
      id: z.string().optional(),
      slug: z.string().optional(),
      symbol: z.string().optional(),
      convert: z.string().optional(),
      convert_id: z.string().optional(),
      skip_invalid: z.boolean().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v2/cryptocurrency/ohlcv/latest', params)
        return formatResponse(data)
      })
    }
  )

  // /cryptocurrency/ohlcv/historical
  server.tool("cryptoOhlcvHistorical",
    "Returns historical OHLCV market values for one or more cryptocurrencies.",
    {
      id: z.string().optional(),
      slug: z.string().optional(),
      symbol: z.string().optional(),
      time_period: z.string().optional(),
      time_start: z.string().optional(),
      time_end: z.string().optional(),
      count: z.number().optional(),
      interval: z.string().optional(),
      convert: z.string().optional(),
      convert_id: z.string().optional(),
      skip_invalid: z.boolean().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v2/cryptocurrency/ohlcv/historical', params)
        return formatResponse(data)
      })
    }
  )

  // /cryptocurrency/price-performance-stats/latest
  server.tool("cryptoPricePerformanceStatsLatest",
    "Returns price performance statistics for one or more cryptocurrencies including ROI and ATH stats.",
    {
      id: z.string().optional(),
      slug: z.string().optional(),
      symbol: z.string().optional(),
      time_period: z.string().optional(),
      convert: z.string().optional(),
      convert_id: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v2/cryptocurrency/price-performance-stats/latest', params)
        return formatResponse(data)
      })
    }
  )

  // /exchange/market-pairs/latest
  server.tool("exchangeMarketPairsLatest",
    "Returns all market pairs for the specified exchange with associated stats.",
    {
      id: z.string().optional(),
      slug: z.string().optional(),
      start: z.number().optional(),
      limit: z.number().optional(),
      convert: z.string().optional(),
      convert_id: z.string().optional(),
      aux: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/exchange/market-pairs/latest', params)
        return formatResponse(data)
      })
    }
  )

  // /exchange/assets
  server.tool("exchangeAssets",
    "Returns the assets/token holdings of an exchange.",
    {
      id: z.string().optional(),
      slug: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/exchange/assets', params)
        return formatResponse(data)
      })
    }
  )

  // /global-metrics/quotes/historical
  server.tool("globalMetricsHistorical",
    "Returns historical global cryptocurrency market metrics.",
    {
      time_start: z.string().optional(),
      time_end: z.string().optional(),
      count: z.number().optional(),
      interval: z.string().optional(),
      convert: z.string().optional(),
      convert_id: z.string().optional(),
      aux: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/global-metrics/quotes/historical', params)
        return formatResponse(data)
      })
    }
  )

  // /fear-and-greed/historical
  server.tool("fearAndGreedHistorical",
    "Returns historical CMC Crypto Fear and Greed Index values.",
    {
      start: z.number().min(1).optional(),
      limit: z.number().min(1).max(500).optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/fear-and-greed/historical', params)
        return formatResponse(data)
      })
    }
  )

  // /blockchain/statistics/latest
  server.tool("blockchainStatisticsLatest",
    "Returns the latest statistics for one or more blockchains.",
    {
      id: z.string().optional(),
      slug: z.string().optional(),
      symbol: z.string().optional()
    },
    async (params) => {
      return handleEndpoint(async () => {
        const data = await makeApiRequest('/v1/blockchain/statistics/latest', params)
        return formatResponse(data)
      })
    }
  )
}

const transport = new StdioServerTransport()
await server.connect(transport)
