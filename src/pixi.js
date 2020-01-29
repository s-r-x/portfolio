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

class Theme {
  constructor(stage) {
    this.lightTxt;
    this.darkTxt;
    this.lightSprite;
    this.darkSprite;
    this.stage = stage;
    this.darkMask;
    this.lightMask;
    this.MASK_RADIUS = 100;
  }
  _createMask() {
    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawCircle(0, 0, this.MASK_RADIUS);
    mask.endFill();
    return mask;
  }
  bootstrap() {
    this.darkTxt = Loader.shared.resources.bg_dark.texture;
    this.lightTxt = Loader.shared.resources.bg_light.texture;
    const lightMask = this._createMask();
    lightMask.scale.set(0, 0);
    this.stage.addChild(lightMask);
    const darkMask = this._createMask();
    darkMask.scale.set(0, 0);
    this.stage.addChild(darkMask);
    this.darkMask = darkMask;
    this.darkSprite = new TilingSprite(
      this.darkTxt,
      document.body.offsetWidth,
      document.body.offsetHeight,
    );
    this.lightSprite = new TilingSprite(
      this.lightTxt,
      document.body.offsetWidth,
      document.body.offsetHeight,
    );
    this.stage.addChild(this.darkSprite);
    this.stage.addChild(this.lightSprite);
    this.lightMask = lightMask;
    this.lightSprite.mask = lightMask;
  }
}
export const theme = new Theme(themeStage);
