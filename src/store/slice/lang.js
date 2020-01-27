import {createSlice} from '@reduxjs/toolkit';

const DOMAIN = 'lang';

const langSlice = createSlice({
  name: DOMAIN,
  initialState: 'ru',
  reducers: {
    changeLang(_, {payload}) {
      return payload;
    },
  },
});

export const {changeLang} = langSlice.actions;

export default langSlice.reducer;
