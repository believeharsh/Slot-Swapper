import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { swapAPI } from '../../services/api';
import type { SwapState, CreateSwapRequestData, SwapRequest} from '../../types';

const initialState: SwapState = {
  swappableSlots: [],
  incomingRequests: [],
  outgoingRequests: [],
  isLoading: false,
  error: null,
};

// ============================================
// ASYNC THUNKS
// ============================================

export const fetchSwappableSlots = createAsyncThunk(
  'swap/fetchSwappableSlots',
  async (_, { rejectWithValue }) => {
    try {
      const response = await swapAPI.getSwappableSlots();
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch swappable slots');
    }
  }
);

export const createSwapRequest = createAsyncThunk(
  'swap/createSwapRequest',
  async (data: CreateSwapRequestData, { rejectWithValue }) => {
    try {
      const response = await swapAPI.createSwapRequest(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create swap request');
    }
  }
);

export const fetchIncomingRequests = createAsyncThunk(
  'swap/fetchIncomingRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await swapAPI.getIncomingRequests();
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch incoming requests');
    }
  }
);

export const fetchOutgoingRequests = createAsyncThunk(
  'swap/fetchOutgoingRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await swapAPI.getOutgoingRequests();
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch outgoing requests');
    }
  }
);

export const respondToSwapRequest = createAsyncThunk(
  'swap/respondToSwapRequest',
  async ({ requestId, accepted }: { requestId: string; accepted: boolean }, { rejectWithValue }) => {
    try {
      const response = await swapAPI.respondToSwapRequest(requestId, { accepted });
      return { requestId, accepted, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to respond to swap request');
    }
  }
);

// ============================================
// SLICE
// ============================================

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSwappableSlots: (state) => {
      state.swappableSlots = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Swappable Slots
    builder
      .addCase(fetchSwappableSlots.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSwappableSlots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.swappableSlots = action.payload;
        state.error = null;
      })
      .addCase(fetchSwappableSlots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Swap Request
    builder
      .addCase(createSwapRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSwapRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.outgoingRequests.unshift(action.payload as SwapRequest);
        state.error = null;
      })
      .addCase(createSwapRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Incoming Requests
    builder
      .addCase(fetchIncomingRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIncomingRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incomingRequests = action.payload;
        state.error = null;
      })
      .addCase(fetchIncomingRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Outgoing Requests
    builder
      .addCase(fetchOutgoingRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOutgoingRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.outgoingRequests = action.payload;
        state.error = null;
      })
      .addCase(fetchOutgoingRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Respond to Swap Request
    builder
      .addCase(respondToSwapRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(respondToSwapRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        const { requestId } = action.payload;
        
        // Remove from incoming requests
        state.incomingRequests = state.incomingRequests.filter(
          req => req._id !== requestId
        );
        
        state.error = null;
      })
      .addCase(respondToSwapRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSwappableSlots } = swapSlice.actions;
export default swapSlice.reducer;