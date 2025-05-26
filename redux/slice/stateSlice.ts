import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  loading: boolean;
}

const initialState: State = {
  loading: false,
};

const stateSlice = createSlice({
  name: "state",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = stateSlice.actions;
export default stateSlice.reducer;
