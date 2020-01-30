import React, {PureComponent} from 'react';
import {THUMB_RATIO, RESIZE_DELAY} from '@/constants';
import throttle from 'lodash.throttle';
import {connect} from 'react-redux';
import {Expo} from 'gsap/EasePack';
import animationManager from '@/pixi/portfolio';

class Thumb extends PureComponent {
  filter = null;
  ref = React.createRef();
  componentDidMount() {
    animationManager.bootstrap({
      container: this.ref.current,
      slides: window.portfolioTextures,
    });
    animationManager.initialRender({
      slideIndex: this.props.activeSlide,
      onComplete: this.props.animationEnd,
      onStart: this.props.animationStart,
    });
    const {activeSlide} = this.props;
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
    animationManager.playExit({activeIndex: this.props.activeSlide});
  };
  resizeHandler = throttle(() => {
    animationManager.resize();
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
  componentDidUpdate(prevProps) {
    const slides = window.portfolioTextures;
    const len = slides.length - 1;
    const {activeSlide} = this.props;
    let isNext;
    if (activeSlide === 0 && prevProps.activeSlide === len) {
      isNext = 1;
    } else if (activeSlide === len && prevProps.activeSlide === 0) {
      isNext = 0;
    } else if (activeSlide > prevProps.activeSlide) {
      isNext = 1;
    } else {
      isNext = 0;
    }
    animationManager.play({
      newIndex: this.props.activeSlide,
      oldIndex: prevProps.activeSlide,
      isNext,
      onComplete: this.props.animationEnd,
    });
  }
  render() {
    return <div ref={this.ref} className="works--thumb" />;
  }
}

export default Thumb;
