import {combineReducers} from 'redux';
import lang from './slice/lang';
import portfolio from './slice/portfolio';
import theme from './slice/theme';
import menu from './slice/menu';

export default combineReducers({
  lang,
  menu,
  portfolio,
  theme,
});
