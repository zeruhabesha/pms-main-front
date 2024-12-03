import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload;
    },
    setSidebarUnfoldable: (state, action) => {
      state.sidebarUnfoldable = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarShow = !state.sidebarShow;
    }
  }
});

export const { setSidebarShow, setSidebarUnfoldable, toggleSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;