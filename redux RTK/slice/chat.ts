import { createSlice } from '@reduxjs/toolkit';
import { User } from '@/utils/module';

interface ChatState {
  userId: string | null;
  selectedUser: User | null;
}

const initialState: ChatState = {
  userId: null,
  selectedUser: null,
};

const idSlice = createSlice({
  name: 'id',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const { setUserId, setSelectedUser } = idSlice.actions;
export default idSlice.reducer;
