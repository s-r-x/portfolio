import initialState from './initialState';
import * as _ from '../actions/constants';

function rootReducer(state = initialState, action) {
  switch(action.type) {
    case _.CHANGE_LANG: 
      return { ...state, lang: action.payload };
    case _.INIT_SLIDES:
      return { ...state, slides: action.payload, activeSlide: 0 };
    case _.NEXT_SLIDE:
      if(state.isAnimating) {
        return state;
      }
      if(state.activeSlide >= state.slides.length - 1) {
        return { ...state, activeSlide: 0, isAnimating: true, };
      }
      else {
        return { ...state, activeSlide: state.activeSlide + 1, isAnimating: true };
      }
    case _.PREV_SLIDE:
      if(state.isAnimating) {
        return state;
      }
      if(state.activeSlide <= 0) {
        return { ...state, activeSlide: state.slides.length - 1, isAnimating: true, };
      }
      else {
        return { ...state, activeSlide: state.activeSlide -1, isAnimating: true };
      }
    case _.CHANGE_ANIMATING_STATE:
      return { ...state, isAnimating: action.payload };
    default:
      console.warn('unknown action: ' + action.type);
      return state;
  }
}

export default rootReducer;
