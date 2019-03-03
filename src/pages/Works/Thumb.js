// fragment shader is from https://tympanus.net/codrops/2018/04/10/webgl-distortion-hover-effects/
import React, { PureComponent } from 'react';
import * as PIXI from 'pixi.js';
import { THUMB_RATIO, RESIZE_DELAY } from '../../constants';
import { scaleSprite, mapNumber, isMobile, clearContainer } from '../../utils';
import throttle from 'lodash.throttle';
import TweenLite from 'gsap/TweenLite';
import TimelineLite from 'gsap/TimelineLite';
import { connect } from 'react-redux';
import { Expo } from 'gsap/EasePack';
import fragShader from './shader.frag';
import { changeAnimatingState, nextSlide, prevSlide } from '../../actions/creators';

// note:: never create pixi app on mount!
// react prevent to gargabe collect webgl context
const pixiApp = new PIXI.Application({
  autoResize: true,
  pixelRatio: window.devicePixelRatio,
  transparent: true,
});
pixiApp.ticker.stop();
let filter;

class Thumb extends PureComponent {
  constructor() {
    super();
    this.ref = React.createRef();
    this.resizeHandler = throttle(this.resizeHandler.bind(this), RESIZE_DELAY);
  }
  componentDidMount() {
    const $wrap = this.ref.current;
    const { renderer, stage } = pixiApp;
    pixiApp.ticker.start();
    this.initFilter()
    this.resizeHandler();
    $wrap.appendChild(renderer.view);
    window.addEventListener('resize', this.resizeHandler);
    if(isMobile) {
      if(window.hasOwnProperty('Hammer')) {
        return this.initHammer();
      }
      import(/* webpackChunkName: "hammer" */ 'hammerjs')
        .then(module => {
          window.Hammer = module.default;
          this.initHammer();
        })
        .catch(e => console.error(e));
    }
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
    pixiApp.ticker.stop();
    if(isMobile) {
      this.hammer.destroy();
    }
  }
  initHammer() {
    const th = this;
    th.hammer = new Hammer(pixiApp.renderer.view);    
    th.hammer.on('swipe', function({ offsetDirection: dir }) {
      if(dir === Hammer.DIRECTION_LEFT) {
        th.props.dispatch(nextSlide());
      }
      else if(dir === Hammer.DIRECTION_RIGHT) {
        th.props.dispatch(prevSlide());
      }
    });
  }
  initFilter() {
    const { activeSlide, slides } = this.props;
    filter = new PIXI.Filter(null, fragShader, { 
      texture1: slides[activeSlide],
      texture2: slides[activeSlide],
      disp: PIXI.Loader.shared.resources.disp.texture,
      dispFactor: 0,
      effectFactor: 1,
      isNext: 1,
    });
    filter.padding = 0;
    pixiApp.stage.filters = [ filter ];

  }
  componentDidUpdate(prevProps) {
    const { activeSlide, slides } = this.props;
    if(activeSlide === prevProps.activeSlide) {
      return;
    }
    const newTexture = slides[activeSlide];
    const oldTexture = slides[prevProps.activeSlide];
    filter.uniforms.texture1 = oldTexture;
    filter.uniforms.texture2 = newTexture;
    filter.uniforms.dispFactor = 0;
    const len = slides.length - 1;
    if(activeSlide === 0 && prevProps.activeSlide === len) {
      filter.uniforms.isNext = 1;
    }
    else if(activeSlide === len && prevProps.activeSlide === 0) {
      filter.uniforms.isNext = 0;
    }
    else if(activeSlide > prevProps.activeSlide) {
      filter.uniforms.isNext = 1;
    }
    else {
      filter.uniforms.isNext = 0;
    }

    TweenLite.to(filter.uniforms, 1, {
      ease: Expo.easeOut,
      dispFactor: 1,
      onComplete: () => this.props.dispatch(changeAnimatingState(false)),
    });
  }
  resizeHandler() {
    const { slides, activeSlide } = this.props;
    const width = this.ref.current.offsetWidth;
    const height = width / THUMB_RATIO;
    clearContainer(pixiApp.stage);
    const graphics = new PIXI.Graphics();
    // need to store something in pixi stage 
    // or it doesn't show anything
    pixiApp.renderer.resize(width, height);
    graphics.drawRect(0, 0, pixiApp.screen.width, pixiApp.screen.height);
    pixiApp.stage.addChild(graphics);
  }
  render() {
    const { activeSlide } = this.props;
    return (
      <div className="works--thumb" ref={this.ref}>
      </div>
    )
  }
}

const mapStateToProps = ({ activeSlide, slides }) => ({
  activeSlide,
  slides,
});
export default connect(mapStateToProps, null)(Thumb);
