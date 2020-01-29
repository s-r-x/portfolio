import {createSlice} from '@reduxjs/toolkit';

const DOMAIN = 'portfolio';

const portfolioSlice = createSlice({
  name: DOMAIN,
  initialState: {
    activeSlide: 0,
    animating: false,
    slidesLoaded: false,
  },
  reducers: {
    initSlides(state) {
      state.slidesLoaded = true;
    },
    nextSlide(state) {
      if (state.animating) return;
      if (state.activeSlide >= window.portfolioTextures.length - 1) {
        state.activeSlide = 0;
        state.animating = true;
      } else {
        state.activeSlide += 1;
        state.animating = true;
      }
    },
    prevSlide(state) {
      if (state.animating) return;
      if (state.activeSlide <= 0) {
        state.activeSlide = window.portfolioTextures.length - 1;
        state.animating = true;
      } else {
        state.activeSlide -= 1;
        state.animating = true;
      }
    },
    animationStart(state) {
      state.animating = true;
    },
    animationEnd(state) {
      state.animating = false;
    },
  },
});

export const {
  initSlides,
  nextSlide,
  prevSlide,
  animationEnd,
  animationStart,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
