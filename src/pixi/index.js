import {
  Renderer,
  Ticker,
  Container,
  Loader,
  Sprite,
  TilingSprite,
  Graphics,
} from 'pixi.js';
import throttle from 'lodash.throttle';

export const renderer = new Renderer(window.innerWidth, window.innerHeight, {
  view: document.getElementById('canvas'),
  transparent: true,
  autoResize: true,
  pixelRatio: window.devicePixelRatio,
  // TODO:: check performance, but without it circle cursor looks ridiculous
  antialias: true,
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

export const rootStage = new Container();
export const portfolioStage = new Container();
export const themeStage = new Container();
export const aboutStage = new Container();
rootStage.addChild(themeStage);
rootStage.addChild(portfolioStage);
rootStage.addChild(aboutStage);
ticker.add(() => {
  renderer.render(rootStage);
});
