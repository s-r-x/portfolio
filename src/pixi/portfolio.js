import {
  Renderer,
  Ticker,
  Container,
  Loader,
  Sprite,
  TilingSprite,
  Graphics,
  Filter,
} from 'pixi.js';
import fragShader from './shader.frag';
import {THUMB_RATIO} from '@/constants';
import {clearContainer} from '@/utils';
import TweenLite from 'gsap/TweenLite';
import {Expo} from 'gsap/EasePack';

class Portfolio {
  slides;
  renderer;
  filter;
  container;
  firstRender = true;
  stage = new Container();
  get emptyTexture() {
    return Loader.shared.resources.empty.texture;
  }
  bootstrap({container, slides}) {
    const width = container.offsetWidth;
    const height = width / THUMB_RATIO;
    this.slides = slides;
    this.renderer = new Renderer(width, height, {
      transparent: true,
      autoResize: true,
      pixelRatio: window.devicePixelRatio,
    });
    this.container = container;
    container.appendChild(this.renderer.view);
    const graphics = new Graphics();
    graphics.drawRect(0, 0, width, height);
    this.stage.addChild(graphics);
    this._initFilter();
  }
  initialRender({onStart, onComplete, slideIndex}) {
    const activeTexture = this.slides[slideIndex];
    const emptyTexture = this.emptyTexture;
    this.filter.uniforms.texture1 = emptyTexture;
    this.filter.uniforms.texture2 = activeTexture;
    if (this.firstRender) {
      this.filter.uniforms.dispFactor = 1;
      this._render();
      this.firstRender = false;
    } else {
      onStart();
      this._play({delay: 0.6, duration: 0.6, onComplete});
    }
  }
  play({isNext, newIndex, oldIndex, onComplete}) {
    this.filter.uniforms.isNext = isNext;
    this.filter.uniforms.texture1 = this.slides[oldIndex];
    this.filter.uniforms.texture2 = this.slides[newIndex];
    this._play({duration: 1, onComplete, ease: Expo.easeOut});
  }
  playExit({activeIndex}) {
    const activeTexture = this.slides[activeIndex];
    const emptyTexture = this.emptyTexture;
    this.filter.uniforms.texture1 = activeTexture;
    this.filter.uniforms.texture2 = emptyTexture;
    this.filter.uniforms.isNext = 0;
    this._play({duration: 0.65});
  }
  resize() {
    const width = this.container.offsetWidth;
    const height = width / THUMB_RATIO;
    clearContainer(this.stage);
    const graphics = new Graphics();
    graphics.drawRect(0, 0, width, height);
    this.stage.addChild(graphics);
    this.renderer.render(this.stage);
  }
  _initFilter() {
    this.filter = new Filter(null, fragShader, {
      disp: Loader.shared.resources.disp.texture,
      dispFactor: 0,
      effectFactor: 1,
      isNext: 0,
    });
    this.filter.padding = 0;
    this.stage.filters = [this.filter];
  }
  _render = () => {
    this.renderer.render(this.stage);
  };
  _play = ({duration, onComplete, ease, delay = 0}) => {
    this.filter.uniforms.dispFactor = 0;
    TweenLite.to(this.filter.uniforms, duration, {
      ease,
      dispFactor: 1,
      onUpdate: this._render,
      onComplete: onComplete && onComplete,
      delay,
    });
  };
}

export default new Portfolio();
