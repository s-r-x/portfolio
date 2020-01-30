import {
  Renderer,
  Ticker,
  Container,
  Loader,
  Sprite,
  TilingSprite,
  Graphics,
} from 'pixi.js';
import debounce from 'lodash.debounce';

export const renderer = new Renderer(window.innerWidth, window.innerHeight, {
  view: document.getElementById('canvas'),
  transparent: true,
  autoResize: true,
  pixelRatio: window.devicePixelRatio,
  // TODO:: check performance, but without it circle cursor looks ridiculous
  antialias: true,
});
window.addEventListener(
  'resize',
  debounce(() => {
    renderer.resize(window.innerWidth, window.innerHeight);
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
