import {Renderer, Ticker} from 'pixi.js';
import throttle from 'lodash.throttle';

export const renderer = new Renderer(window.innerWidth, window.innerHeight, {
  view: document.getElementById('canvas'),
  transparent: true,
  autoResize: true,
  pixelRatio: window.devicePixelRatio,
});
// TODO:: do we need it?
window.addEventListener(
  'resize',
  throttle(() => {
    renderer.resize(document.body.offsetWidth, document.body.offsetHeight);
  }, 250),
);
export const ticker = Ticker.shared;
ticker.autoStart = true;
