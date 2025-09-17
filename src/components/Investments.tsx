import { useEffect, useState } from 'react';

function TrendingSection() {
  const [trending, setTrending] = useState<
    {
      rank: number;
      name: string;
      symbol: string;
      icon: string;
      change: number;
    }[]
  >([]);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/search/trending'
        );
        const data = await res.json();
        const coins = await Promise.all(
          data.coins.slice(0, 3).map(async (c, i) => {
            try {
              const marketRes = await fetch(
                `https://api.coingecko.com/api/v3/coins/${c.item.id}?localization=false&tickers=false&market_data=true`
              );
              const marketData = await marketRes.json();
              return {
                rank: i + 1,
                name: c.item.name,
                symbol: c.item.symbol.toUpperCase(),
                icon: c.item.large,
                change:
                  marketData.market_data?.price_change_percentage_24h ?? 0,
              };
            } catch {
              return {
                rank: i + 1,
                name: c.item.name,
                symbol: c.item.symbol.toUpperCase(),
                icon: c.item.large,
                change: 0,
              };
            }
          })
        );
        setTrending(coins);
      } catch (err) {
        setTrending([]);
      }
    }
    fetchTrending();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="font-semibold mb-2 flex items-center gap-2">
        <span role="img" aria-label="fire">
          🔥
        </span>{' '}
        Trending
        <span className="ml-auto">
          <button className="text-gray-400 hover:text-gray-600">
            <svg width="20" height="20" fill="none">
              <path
                d="M7 10l5-5m0 0l-5 5m5-5v10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </span>
      </div>
      <ul>
        {trending.length === 0 ? (
          <li className="text-gray-400 py-2">Loading...</li>
        ) : (
          trending.map((item) => (
            <li
              key={item.rank}
              className="flex justify-between items-center py-1"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-500">
                  {item.rank}.
                </span>
                <img
                  src={item.icon}
                  alt={item.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-semibold">{item.name}</span>
                <span className="text-gray-500 text-xs">{item.symbol}</span>
              </div>
              <span
                className={item.change > 0 ? 'text-green-600' : 'text-red-600'}
              >
                {item.change > 0 ? '+' : ''}
                {item.change.toFixed(2)}%
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function HotNewsSection() {
  const [news, setNews] = useState<{ title: string; link: string }[]>([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(
          'https://api.coinstats.app/public/v1/news?skip=0&limit=5'
        );
        const data = await res.json();
        setNews(
          data.news.map((n: { title: string; link: string }) => ({
            title: n.title,
            link: n.link,
          }))
        );
      } catch (err) {
        setNews([]);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="font-semibold mb-2 flex items-center gap-2">
        <span role="img" aria-label="fire">
          🔥
        </span>{' '}
        Hot News
      </div>
      <ul>
        {news.length === 0 ? (
          <li className="text-gray-400 py-2">Loading...</li>
        ) : (
          news.map((n, i) => (
            <li key={i} className="text-gray-700 py-1">
              <a
                href={n.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {n.title}
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

const coins = [
  // Crypto
  {
    rank: 1,
    name: 'BTC',
    full: 'Bitcoin',
    logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    price: 66595.59,
    change24h: 0.45,
    vol24h: '19.59B',
    mcap: '1,311.18B',
    roi1m: -1.02,
    roi1y: 142.07,
    type: 'crypto',
  },
  {
    rank: 2,
    name: 'ETH',
    full: 'Ethereum',
    logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    price: 3186.5,
    change24h: -1.36,
    vol24h: '9.26B',
    mcap: '382.16B',
    roi1m: -7.86,
    roi1y: 72.84,
    type: 'crypto',
  },
  {
    rank: 3,
    name: 'USDT',
    full: 'Tether',
    logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    price: 1.0,
    change24h: 0.0,
    vol24h: '25.81B',
    mcap: '109.90B',
    roi1m: 0.05,
    roi1y: 0.05,
    type: 'crypto',
  },
  // Stocks (Actions)
  {
    rank: 4,
    name: 'AAPL',
    full: 'Apple',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    price: 195.12,
    change24h: 1.12,
    vol24h: '89.2M',
    mcap: '3.04T',
    roi1m: 2.5,
    roi1y: 35.1,
    type: 'stocks',
  },
  {
    rank: 5,
    name: 'GOOGL',
    full: 'Google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    price: 142.56,
    change24h: -0.42,
    vol24h: '22.1M',
    mcap: '1.77T',
    roi1m: 1.8,
    roi1y: 28.7,
    type: 'stocks',
  },
  // ETFs
  {
    rank: 6,
    name: 'SPY',
    full: 'S&P 500 ETF',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/SPDR_logo.png',
    price: 525.34,
    change24h: 0.23,
    vol24h: '12.3M',
    mcap: '450B',
    roi1m: 3.2,
    roi1y: 18.4,
    type: 'etf',
  },
  {
    rank: 7,
    name: 'QQQ',
    full: 'NASDAQ ETF',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Invesco_logo.svg',
    price: 462.11,
    change24h: 0.67,
    vol24h: '8.7M',
    mcap: '220B',
    roi1m: 4.1,
    roi1y: 22.9,
    type: 'etf',
  },
  // CFDs
  {
    rank: 8,
    name: 'GOLD CFD',
    full: 'Gold CFD',
    logo: 'https://cryptologos.cc/logos/gold-gold-logo.png',
    price: 2345.67,
    change24h: -0.15,
    vol24h: '1.2B',
    mcap: 'N/A',
    roi1m: 0.9,
    roi1y: 7.2,
    type: 'cfd',
  },
  {
    rank: 9,
    name: 'OIL CFD',
    full: 'Oil CFD',
    logo: 'https://cryptologos.cc/logos/oil-oil-logo.png',
    price: 78.34,
    change24h: 0.32,
    vol24h: '2.5B',
    mcap: 'N/A',
    roi1m: 1.2,
    roi1y: 4.8,
    type: 'cfd',
  },
];
const investmentFilters = [
  { id: 'crypto', label: 'Crypto', icon: '🪙' },
  { id: 'etf', label: 'ETF', icon: '📈' },
  { id: 'cfd', label: 'CFD', icon: '💹' },
  { id: 'stocks', label: 'Actions', icon: '🏦' },
  { id: 'all', label: 'All', icon: '🌐' },
];
export default function Investments() {
  const [activeFilter, setActiveFilter] = useState('crypto');
  // Filter coins by activeFilter
  const filteredCoins =
    activeFilter === 'all'
      ? coins
      : coins.filter((coin) => coin.type === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Top widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Trending */}
        <TrendingSection />
        {/* Hot News */}
        <HotNewsSection />
        {/* Fear & Greed Index */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center">
          <div className="font-semibold mb-2">Fear & Greed Index (FGI)</div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-2xl font-bold text-gray-900">47</span>
            </div>
            <span className="text-gray-600 font-medium">Neutral</span>
          </div>
        </div>
      </div>

      {/* Table controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Filter Bar */}
        <div className="mb-6">
          <div className="flex gap-4">
            {investmentFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold text-lg transition-all
                ${
                  activeFilter === filter.id
                    ? 'bg-purple-700 text-white shadow'
                    : 'bg-gray-100 text-gray-900 hover:bg-purple-50'
                }`}
              >
                <span className="text-xl">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-lg px-3 py-2 bg-gray-50 text-gray-900"
        />
        <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium">
          Market Cap
        </button>
        <button className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium">
          Top Gainers
        </button>
      </div>

      {/* Coins Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Coin</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">24H %</th>
              <th className="py-3 px-4 text-left">24H Vol.</th>
              <th className="py-3 px-4 text-left">M. Cap</th>
              <th className="py-3 px-4 text-left">1M ROI</th>
              <th className="py-3 px-4 text-left">1Y ROI</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoins.map((coin) => (
              <tr key={coin.rank} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 font-semibold">{coin.rank}</td>
                <td className="py-2 px-4 flex items-center gap-2">
                  <img
                    src={coin.logo}
                    alt={coin.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium">{coin.name}</span>
                  <span className="text-gray-500 text-xs">({coin.full})</span>
                </td>
                <td className="py-2 px-4 font-semibold">
                  ${coin.price.toLocaleString()}
                </td>
                <td
                  className={`py-2 px-4 font-semibold ${coin.change24h > 0 ? 'text-green-600' : coin.change24h < 0 ? 'text-red-600' : 'text-gray-600'}`}
                >
                  {coin.change24h > 0 ? '+' : ''}
                  {coin.change24h}%
                </td>
                <td className="py-2 px-4">{coin.vol24h}</td>
                <td className="py-2 px-4">{coin.mcap}</td>
                <td
                  className={`py-2 px-4 ${coin.roi1m > 0 ? 'text-green-600' : coin.roi1m < 0 ? 'text-red-600' : 'text-gray-600'}`}
                >
                  {coin.roi1m > 0 ? '+' : ''}
                  {coin.roi1m}%
                </td>
                <td
                  className={`py-2 px-4 ${coin.roi1y > 0 ? 'text-green-600' : coin.roi1y < 0 ? 'text-red-600' : 'text-gray-600'}`}
                >
                  {coin.roi1y > 0 ? '+' : ''}
                  {coin.roi1y}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer bar */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs">
        <span className="text-gray-700">
          ADA <span className="text-red-600">$0.5074 -0.22%</span>
        </span>
        <span className="text-gray-700">
          SHIB <span className="text-red-600">$0.00002624 -3.10%</span>
        </span>
        <span className="text-gray-700">
          AVAX <span className="text-green-600">$38.65 +1.05%</span>
        </span>
        <span className="text-gray-700">
          DOT <span className="text-gray-600">$7.366 +1.05%</span>
        </span>
        <span className="text-gray-700">
          BCH <span className="text-red-600">$509.2 -0.27%</span>
        </span>
        {/* Add more coins as needed */}
      </div>
    </div>
  );
}
