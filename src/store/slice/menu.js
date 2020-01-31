import {createSlice} from '@reduxjs/toolkit';

const DOMAIN = 'menu';

const menuSlice = createSlice({
  name: DOMAIN,
  initialState: {
    isOpen: false,
  },
  reducers: {
    openMenu(state) {
      state.isOpen = true;
    },
    closeMenu(state) {
      state.isOpen = false;
    },
  },
});

export const {openMenu, closeMenu} = menuSlice.actions;

export default menuSlice.reducer;
