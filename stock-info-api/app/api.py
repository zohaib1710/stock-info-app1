# app/api.py
from fastapi import APIRouter, Query
from app.utils import get_stock_info, search_symbols

router = APIRouter()

@router.get("/stock")
def fetch_stock(symbol: str = Query(..., min_length=1)):
    return get_stock_info(symbol)


@router.get("/search")
def search_stock_symbols(query: str = Query(..., min_length=1)):
    """
    Returns up to 10 stock symbols matching the search query.
    """
    return search_symbols(query)
