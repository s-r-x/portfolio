import {combineReducers} from 'redux';
import lang from './slice/lang';
import portfolio from './slice/portfolio';
import theme from './slice/theme';

export default combineReducers({
  lang,
  portfolio,
  theme,
});
