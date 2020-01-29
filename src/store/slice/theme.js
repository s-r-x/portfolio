import {createSlice} from '@reduxjs/toolkit';

const DOMAIN = 'theme';

const themeSlice = createSlice({
  name: DOMAIN,
  initialState: 'dark',
  reducers: {
    changeTheme(_, {payload}) {
      return payload;
    },
  },
});

export const {changeTheme} = themeSlice.actions;

export default themeSlice.reducer;
