// fragment shader is from https://tympanus.net/codrops/2018/04/10/webgl-distortion-hover-effects/
import React, {PureComponent} from 'react';
import * as PIXI from 'pixi.js';
import {THUMB_RATIO, RESIZE_DELAY} from '../../constants';
import {scaleSprite, mapNumber, isMobile, clearContainer} from '../../utils';
import throttle from 'lodash.throttle';
import TweenLite from 'gsap/TweenLite';
import {connect} from 'react-redux';
import {Expo} from 'gsap/EasePack';
import fragShader from './shader.frag';
import vertShader from './shader.vert';
import {renderer, ticker} from '@/pixi';
const {Container, Rectangle} = PIXI;

let filter;
let stage;

class Thumb extends PureComponent {
  constructor() {
    super();
    this.ref = React.createRef();
    this.resizeHandler = throttle(this.resizeHandler.bind(this), RESIZE_DELAY);
  }
  componentDidMount() {
    if (!stage) {
      stage = new Container();
      this.initFilter();
      this.resizeHandler();
    }
    ticker.add(this.onTick);
    window.addEventListener('resize', this.resizeHandler);
    if (window.hasOwnProperty('Hammer')) {
      return this.initHammer();
    }
    import(/* webpackChunkName: "hammer" */ 'hammerjs').then(module => {
      window.Hammer = module.default;
      this.initHammer();
    });
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
    this.hammer.destroy();
    ticker.remove(this.onTick);
  }
  onTick() {
    renderer.render(stage);
  }
  initHammer() {
    const th = this;
    th.hammer = new Hammer(this.ref.current);
    th.hammer.on('swipe', function({offsetDirection: dir}) {
      if (dir === Hammer.DIRECTION_LEFT) {
        th.props.nextSlide();
      } else if (dir === Hammer.DIRECTION_RIGHT) {
        th.props.prevSlide();
      }
    });
  }
  initFilter() {
    const {activeSlide} = this.props;
    const slides = window.portfolioTextures;
    if (!filter) {
      filter = new PIXI.Filter(vertShader, fragShader, {
        texture1: slides[activeSlide],
        texture2: slides[activeSlide],
        disp: PIXI.Loader.shared.resources.disp.texture,
        dispFactor: 1,
        effectFactor: 1,
        isNext: 1,
      });
      filter.padding = 0;
      stage.filters = [filter];
    }
  }
  componentDidUpdate(prevProps) {
    const {activeSlide} = this.props;
    if (activeSlide === prevProps.activeSlide) {
      return;
    }
    const slides = window.portfolioTextures;
    const newTexture = slides[activeSlide];
    const oldTexture = slides[prevProps.activeSlide];
    filter.uniforms.texture1 = oldTexture;
    filter.uniforms.texture2 = newTexture;
    filter.uniforms.dispFactor = 0;
    const len = slides.length - 1;
    if (activeSlide === 0 && prevProps.activeSlide === len) {
      filter.uniforms.isNext = 1;
    } else if (activeSlide === len && prevProps.activeSlide === 0) {
      filter.uniforms.isNext = 0;
    } else if (activeSlide > prevProps.activeSlide) {
      filter.uniforms.isNext = 1;
    } else {
      filter.uniforms.isNext = 0;
    }

    TweenLite.to(filter.uniforms, 1, {
      ease: Expo.easeOut,
      dispFactor: 1,
      onComplete: () => this.props.animationEnd(),
    });
  }
  resizeHandler() {
    const {slides, activeSlide} = this.props;
    const width = this.ref.current.offsetWidth;
    const bounds = this.ref.current.getBoundingClientRect();
    const height = width / THUMB_RATIO;
    clearContainer(stage);
    const graphics = new PIXI.Graphics();
    graphics.drawRect(bounds.x, bounds.y, width, height);
    stage.addChild(graphics);
  }
  render() {
    return <div className="works--thumb" ref={this.ref} />;
  }
}

export default Thumb;
