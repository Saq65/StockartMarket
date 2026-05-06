import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stocks: [],
  watchlist: [],
  selectedStock: null,
  isLoading: false,
  indices: {
    nifty: 0,
    sensex: 0,
    bankNifty: 0,
  },
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setStocks(state, action) {
      state.stocks = action.payload;
    },
    setSelectedStock(state, action) {
      state.selectedStock = action.payload;
    },
    addToWatchlist(state, action) {
      if (!state.watchlist.includes(action.payload)) {
        state.watchlist.push(action.payload);
      }
    },
    removeFromWatchlist(state, action) {
      state.watchlist = state.watchlist.filter(s => s !== action.payload);
    },
    setIndices(state, action) {
      state.indices = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setStocks,
  setSelectedStock,
  addToWatchlist,
  removeFromWatchlist,
  setIndices,
  setLoading,
} = marketSlice.actions;
export default marketSlice.reducer;