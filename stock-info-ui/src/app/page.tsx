'use client'

import { useState, useEffect } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Suggestion {
  symbol: string
  name: string
  exchange: string
}

export default function Home() {
  const [symbol, setSymbol] = useState("")
  const [stockData, setStockData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!symbol.trim()) {
      setSuggestions([])
      return
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/search?query=${symbol}`)
        setSuggestions(res.data || [])
        setShowSuggestions(true)
      } catch (err) {
        console.error(err)
      }
    }, 300) // 300ms debounce
    return () => clearTimeout(delayDebounce)
  }, [symbol])

  const fetchStock = async (selectedSymbol?: string) => {
    const finalSymbol = selectedSymbol || symbol
    if (!finalSymbol) return
    setLoading(true)
    setShowSuggestions(false)
    try {
      const res = await axios.get(`http://127.0.0.1:8000/stock?symbol=${finalSymbol}`)
      setStockData(res.data)
      setSymbol(finalSymbol)
    } catch (err) {
      console.error(err)
      setStockData(null)
    } finally {
      setLoading(false)
    }
  }

  // Pass only symbol string on suggestion click
  const handleSuggestionClick = (suggestionSymbol: string) => {
    setShowSuggestions(false)
    setSymbol(suggestionSymbol)
    fetchStock(suggestionSymbol)
  }

  const ratioKeys = [
    "year",
    "roe",
    "roa",
    "grossMargin",
    "operatingMargin",
    "netMargin",
    "eps_basic",
    "dividendYield",
    "payoutRatio",
    "peRatio",
    "bookValuePerShare",
    "roce",
    "debtToEquity",
    "interestCoverage",
    "currentRatio",
    "quickRatio"
  ]

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-6 space-y-6">
      {/* Search */}
      <div className="relative w-full max-w-xl">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter stock symbol (e.g. AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            onFocus={() => symbol && setShowSuggestions(true)}
          />
          <Button onClick={() => fetchStock()} disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </Button>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSuggestionClick(s.symbol)} // pass only symbol string here
              >
                <span className="font-semibold">{s.symbol}</span> — {s.name}{" "}
                <span className="text-xs text-gray-500">({s.exchange})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Stock Info Display */}
      {stockData && (
        <Card className="w-full max-w-4xl">
          <CardContent className="p-6 space-y-4">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-semibold">
                {stockData.name} ({stockData.symbol})
              </h2>
              <p className="text-sm text-muted-foreground">
                {stockData.exchange} • {stockData.industry}
              </p>
              <p className="mt-2">
                <strong>Current Price:</strong> ${stockData.current_price}
              </p>
              <p>
                <strong>Market Cap:</strong> $
                {Number(stockData.market_cap).toLocaleString()}
              </p>
              <p>
                <strong>Currency:</strong> {stockData.currency}
              </p>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">About the Company</h3>
              <p className="text-sm text-muted-foreground">{stockData.description}</p>
            </div>

            {/* Tabs for Ratios and Returns */}
            <Tabs defaultValue="ratios" className="w-full mt-6">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="ratios">Financial Ratios</TabsTrigger>
                <TabsTrigger value="returns">Historical Returns</TabsTrigger>
              </TabsList>

              {/* Ratios Table */}
              <TabsContent value="ratios">
                <div className="overflow-x-auto">
                  <div className="min-w-max">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Year</TableHead>
                          <TableHead>ROE</TableHead>
                          <TableHead>ROA</TableHead>
                          <TableHead>Gross Margin</TableHead>
                          <TableHead>Operating Margin</TableHead>
                          <TableHead>Net Margin</TableHead>
                          <TableHead>EPS (Basic)</TableHead>
                          <TableHead>Dividend Yield</TableHead>
                          <TableHead>Payout Ratio</TableHead>
                          <TableHead>P/E</TableHead>
                          <TableHead>Book Value</TableHead>
                          <TableHead>ROCE</TableHead>
                          <TableHead>D/E</TableHead>
                          <TableHead>Interest Coverage</TableHead>
                          <TableHead>Current Ratio</TableHead>
                          <TableHead>Quick Ratio</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stockData.financial_ratios.map((row: any, i: number) => (
                          <TableRow key={i}>
                            {ratioKeys.map((key) => (
                              <TableCell key={key}>
                                {row[key] != null
                                  ? typeof row[key] === "number"
                                    ? row[key].toFixed(2)
                                    : row[key]
                                  : "-"}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Returns Table */}
              <TabsContent value="returns">
                <ScrollArea className="h-[400px] w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Opening Price</TableHead>
                        <TableHead>Closing Price</TableHead>
                        <TableHead>Change (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockData.historical_returns.map((item: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell>{item.year}</TableCell>
                          <TableCell>{item.opening_price?.toFixed(2)}</TableCell>
                          <TableCell>{item.closing_price?.toFixed(2)}</TableCell>
                          <TableCell>{item.change_pct?.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
