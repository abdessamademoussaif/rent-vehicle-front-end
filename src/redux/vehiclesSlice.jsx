import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const searchVehicles = createAsyncThunk(
  'vehicles/searchVehicles',
  async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/v1/vehicles/${queryString ? `search?${queryString}` : ''}`
    );
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    const data = await res.json();
    return data.data;
  }
);


const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchVehicles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(searchVehicles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default vehiclesSlice.reducer;
