import * as _ from './constants';
export const changeLang = lang => ({
  type: _.CHANGE_LANG,
  payload: lang,
});
export const nextSlide = () => ({
  type: _.NEXT_SLIDE,
});
export const prevSlide = () => ({
  type: _.PREV_SLIDE,
});
export const initSlides = slides => ({
  type: _.INIT_SLIDES,
  payload: slides,
});
// true / false
export const changeAnimatingState = state => ({
  type: _.CHANGE_ANIMATING_STATE,
  payload: state,
});
