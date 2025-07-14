import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  checked: boolean;
}

const initialState: AuthState = {
  user: null,
  checked: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: NonNullable<AuthState['user']> }>) {
      state.user = action.payload.user;
      state.checked = true;
    },
    logout(state) {
      state.user = null;
      state.checked = true;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;