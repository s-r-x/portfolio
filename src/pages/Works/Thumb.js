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
import {renderer, portfolioStage as stage} from '@/pixi';
const {Rectangle, Graphics} = PIXI;

class Thumb extends PureComponent {
  filter = null;
  ref = React.createRef();
  componentDidMount() {
    this.initFilter();
    this.resizeHandler();
    window.addEventListener('resize', this.resizeHandler);
    if (window.hasOwnProperty('Hammer')) {
      this.initHammer();
    } else {
      import(/* webpackChunkName: "hammer" */ 'hammerjs').then(module => {
        window.Hammer = module.default;
        this.initHammer();
      });
    }
    __ee__.on('transition/portfolio_exit', this.playExitAnimation);
  }
  componentWillUnmount() {
    __ee__.off('transition/portfolio_exit', this.playExitAnimation);
    window.removeEventListener('resize', this.resizeHandler);
    this.hammer.destroy();
  }
  playExitAnimation = () => {
    const {activeSlide} = this.props;
    const slides = window.portfolioTextures;
    const oldTexture = slides[activeSlide];
    const newTexture = PIXI.Loader.shared.resources.empty.texture;
    this.filter.uniforms.texture1 = oldTexture;
    this.filter.uniforms.texture2 = newTexture;
    this.filter.uniforms.dispFactor = 0;
    this.filter.uniforms.isNext = 1;
    TweenLite.to(this.filter.uniforms, .65, {
      dispFactor: 1,
    });
  };
  resizeHandler = throttle(() => {
    const {slides, activeSlide} = this.props;
    const width = this.ref.current.offsetWidth;
    const bounds = this.ref.current.getBoundingClientRect();
    const height = width / THUMB_RATIO;
    clearContainer(stage);
    const graphics = new Graphics();
    stage.x = bounds.x;
    stage.y = bounds.y;
    graphics.drawRect(0, 0, width, height);
    stage.addChild(graphics);
  }, RESIZE_DELAY);
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
    const slide = slides[activeSlide];
    const oldTexture = slides[activeSlide];
    const newTexture = PIXI.Loader.shared.resources.empty.texture;

    this.filter = new PIXI.Filter(vertShader, fragShader, {
      texture1: newTexture,
      texture2: oldTexture,
      disp: PIXI.Loader.shared.resources.disp.texture,
      dispFactor: 0,
      effectFactor: 1,
      isNext: 0,
    });
    this.filter.padding = 0;
    stage.filters = [this.filter];
    this.props.animationStart();
    TweenLite.to(this.filter.uniforms, 1, {
      ease: Expo.easeOut,
      dispFactor: 1,
      onComplete: () => this.props.animationEnd(),
    }).delay(0.6);
  }
  componentDidUpdate(prevProps) {
    const {activeSlide} = this.props;
    if (activeSlide === prevProps.activeSlide) {
      return;
    }
    const slides = window.portfolioTextures;
    const newTexture = slides[activeSlide];
    const oldTexture = slides[prevProps.activeSlide];
    this.filter.uniforms.texture1 = oldTexture;
    this.filter.uniforms.texture2 = newTexture;
    this.filter.uniforms.dispFactor = 0;
    const len = slides.length - 1;
    if (activeSlide === 0 && prevProps.activeSlide === len) {
      this.filter.uniforms.isNext = 1;
    } else if (activeSlide === len && prevProps.activeSlide === 0) {
      this.filter.uniforms.isNext = 0;
    } else if (activeSlide > prevProps.activeSlide) {
      this.filter.uniforms.isNext = 1;
    } else {
      this.filter.uniforms.isNext = 0;
    }

    TweenLite.to(this.filter.uniforms, 1, {
      ease: Expo.easeOut,
      dispFactor: 1,
      onComplete: () => this.props.animationEnd(),
    });
  }
  render() {
    return <div className="works--thumb" ref={this.ref} />;
  }
}

export default Thumb;
