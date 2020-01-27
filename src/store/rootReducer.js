import {combineReducers} from 'redux';
import lang from './slice/lang';
import portfolio from './slice/portfolio';

export default combineReducers({
  lang,
  portfolio,
});
