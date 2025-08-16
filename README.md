# Stock Information Application

A comprehensive stock information application with a FastAPI backend and Next.js frontend that provides detailed financial data, ratios, and historical returns for publicly traded companies.

## Features

- **Stock Search**: Search for stocks by symbol with autocomplete suggestions
- **Company Profile**: Basic company information including name, exchange, industry, and market cap
- **Financial Ratios**: 20 years of key financial ratios including:
  - ROE, ROA, Gross Margin, Operating Margin, Net Margin
  - EPS, Dividend Yield, Payout Ratio, P/E Ratio
  - Book Value per Share, ROCE, Debt-to-Equity
  - Interest Coverage, Current Ratio, Quick Ratio
- **Historical Returns**: Yearly opening/closing prices and percentage changes
- **Real-time Data**: Powered by Financial Modeling Prep (FMP) API

## Project Structure

```
stock-info-app/
├── stock-info-api/          # FastAPI backend
│   ├── app/
│   │   ├── api.py          # API endpoints
│   │   └── utils.py        # Data fetching and processing
│   ├── main.py             # FastAPI application entry point
│   └── requirements.txt    # Python dependencies
├── stock-info-ui/          # Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   └── components/     # UI components
│   ├── package.json        # Node.js dependencies
│   └── tailwind.config.js  # Tailwind CSS configuration
└── README.md               # This file
```

## Prerequisites

- Python 3.8+
- Node.js 18+
- Financial Modeling Prep API key

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd stock-info-api
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the `stock-info-api` directory:
   ```
   FMP_API_KEY=your_api_key_here
   ```

6. Run the backend server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd stock-info-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### GET /stock
Fetch comprehensive stock information for a given symbol.

**Parameters:**
- `symbol` (required): Stock ticker symbol (e.g., AAPL, MSFT)

**Response:** Company profile, financial ratios, and historical returns

### GET /search
Search for stock symbols matching a query.

**Parameters:**
- `query` (required): Search term for stock symbols

**Response:** List of matching stock symbols with names and exchanges

## Usage

1. Open the application in your browser
2. Enter a stock symbol in the search box
3. Select from the autocomplete suggestions or press Enter
4. View the comprehensive financial data in the organized tabs
5. Switch between Financial Ratios and Historical Returns views

## Technologies Used

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Python**: Core programming language
- **Financial Modeling Prep API**: Financial data provider
- **Uvicorn**: ASGI server for running FastAPI

### Frontend
- **Next.js 15**: React framework with app router
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Axios**: HTTP client for API calls

## Environment Variables

Create a `.env` file in the `stock-info-api` directory:

```env
FMP_API_KEY=your_financial_modeling_prep_api_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please open an issue in the repository.
