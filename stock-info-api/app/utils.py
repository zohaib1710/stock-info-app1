import requests
import os
from dotenv import load_dotenv

load_dotenv()
FMP_API_KEY = os.getenv("FMP_API_KEY")
BASE_URL = "https://financialmodelingprep.com/api/v3"


def get_stock_info(symbol: str):
    # 1. Company profile
    profile_url = f"{BASE_URL}/profile/{symbol}?apikey={FMP_API_KEY}"
    profile_response = requests.get(profile_url)
    if profile_response.status_code != 200 or not profile_response.json():
        return {"error": "Failed to fetch stock profile"}
    profile = profile_response.json()[0]

    # 2. Key Ratios (20 years)
    ratios_url = f"{BASE_URL}/ratios/{symbol}?limit=20&apikey={FMP_API_KEY}"
    ratios_response = requests.get(ratios_url)
    ratios_data = ratios_response.json() if ratios_response.status_code == 200 else []

    # 3. EPS (basic only)
    income_url = f"{BASE_URL}/income-statement/{symbol}?limit=20&apikey={FMP_API_KEY}"
    income_response = requests.get(income_url)
    income_data = income_response.json() if income_response.status_code == 200 else []

    # Merge datasets by year
    financial_ratios = []
    for ratio in ratios_data:
        year = ratio["date"][:4]
        eps_basic = next(
            (item.get("earningsPerShareBasic") or item.get("eps")
             for item in income_data if item["date"][:4] == year),
            None
        )

        entry = {
            "year": year,
            "roe": ratio.get("returnOnEquity"),
            "roa": ratio.get("returnOnAssets"),
            "grossMargin": ratio.get("grossProfitMargin"),
            "operatingMargin": ratio.get("operatingProfitMargin"),
            "netMargin": ratio.get("netProfitMargin"),
            "eps_basic": eps_basic,
            "dividendYield": ratio.get("dividendYield"),
            "payoutRatio": ratio.get("payoutRatio"),
            "peRatio": ratio.get("priceEarningsRatio"),
            "bookValuePerShare": ratio.get("bookValuePerShare"),
            "roce": ratio.get("returnOnCapitalEmployed"),
            "debtToEquity": ratio.get("debtEquityRatio"),
            "interestCoverage": ratio.get("interestCoverage"),
            "currentRatio": ratio.get("currentRatio"),
            "quickRatio": ratio.get("quickRatio"),
        }

        # Remove keys with None values
        entry = {k: v for k, v in entry.items() if v is not None}
        financial_ratios.append(entry)

    # 4. Historical Prices (Yearly Opening / Closing / Change)
    historical_url = f"{BASE_URL}/historical-price-full/{symbol}?serietype=line&apikey={FMP_API_KEY}"
    history_resp = requests.get(historical_url)
    history_data = history_resp.json().get("historical", []) if history_resp.status_code == 200 else []

    # Fix: ensure we correctly identify earliest (opening) and latest (closing) trading day per year
    annual_prices = {}
    for record in history_data:
        date = record.get("date")
        if not date:
            continue
        year = date[:4]
        price = record.get("adjClose", record.get("close"))
        if price is None:
            continue

        if year not in annual_prices:
            annual_prices[year] = {
                "min_date": date,
                "min_price": price,
                "max_date": date,
                "max_price": price,
            }
        else:
            if date < annual_prices[year]["min_date"]:
                annual_prices[year]["min_date"] = date
                annual_prices[year]["min_price"] = price
            if date > annual_prices[year]["max_date"]:
                annual_prices[year]["max_date"] = date
                annual_prices[year]["max_price"] = price

    historical_returns = []
    for year in sorted(annual_prices.keys(), reverse=True)[:20]:
        opening_price = annual_prices[year]["min_price"]
        closing_price = annual_prices[year]["max_price"]
        try:
            pct_change = ((closing_price - opening_price) / opening_price) * 100
        except ZeroDivisionError:
            pct_change = None
        historical_returns.append({
            "year": year,
            "opening_price": round(opening_price, 2),
            "closing_price": round(closing_price, 2),
            "change_pct": round(pct_change, 2) if pct_change is not None else None
        })

    return {
        "symbol": profile["symbol"],
        "name": profile["companyName"],
        "exchange": profile["exchangeShortName"],
        "industry": profile.get("industry", "N/A"),
        "current_price": profile["price"],
        "market_cap": profile["mktCap"],
        "currency": profile["currency"],
        "description": profile.get("description", "No description available."),
        "financial_ratios": financial_ratios,
        "historical_returns": historical_returns
    }


def search_symbols(query):
    """
    Search stock symbols from FMP API.
    Returns a simplified list of matching tickers.
    """
    url = f"{BASE_URL}/search?query={query}&limit=10&apikey={FMP_API_KEY}"
    response = requests.get(url)
    if response.status_code != 200:
        return []
    results = response.json()
    return [
        {
            "symbol": r.get("symbol"),
            "name": r.get("name"),
            "exchange": r.get("exchangeShortName", "")
        }
        for r in results
        if r.get("symbol") and r.get("name")
    ]
