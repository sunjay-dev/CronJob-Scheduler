import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: NonNullable<AuthState['user']> }>) {
      state.user = action.payload.user;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;