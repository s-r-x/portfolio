import './polyfills/objectAssign';
import './polyfills/isInteger';
import './polyfills/find';
import 'promise-polyfill/src/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import  store  from './store';
import CSSPlugin from 'gsap/CSSPlugin';
import loadAssets, { loader } from './loader';
import hidePreloader from './preloader';
const EventEmitter = require('wolfy87-eventemitter');
window.__ee__ = new EventEmitter();

const gsapPlugins = [ CSSPlugin ];

if (module.hot) module.hot.accept()

loadAssets(() => {
  __ee__.emit('assets_load');
  hidePreloader();
});
const $root = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , $root);
