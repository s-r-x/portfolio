import React, { PureComponent } from 'react';
import * as PIXI from 'pixi.js';
import { THUMB_RATIO, RESIZE_DELAY } from '../../constants';
import { scaleSprite, mapNumber, isMobile, clearContainer } from '../../utils';
import throttle from 'lodash.throttle';
import TweenLite from 'gsap/TweenLite';
import TimelineLite from 'gsap/TimelineLite';
import { connect } from 'react-redux';
import { Expo } from 'gsap/EasePack';

// note:: never create pixi app on mount!
// react prevent to gargabe collect webgl context
const pixiApp = new PIXI.Application({
  autoResize: true,
  pixelRatio: window.devicePixelRatio,
  transparent: true,
});
const slidesContainer = new PIXI.Container();
pixiApp.stage.addChild(slidesContainer);
pixiApp.ticker.stop();
let filterSprite;
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
    const { activeSlide, slides } = this.props;
    // back from another route case. 
    // slide is already here. don't touch it!
    if(slidesContainer.children.length !== 0) {
    }
    else {
      filterSprite = new PIXI.Sprite(PIXI.Loader.shared.resources.disp.texture);
      filter = new PIXI.filters.DisplacementFilter(filterSprite);

      filterSprite.scale = new PIXI.Point(2, 2);
      filter.scale = new PIXI.Point(0, 0);
      filter.padding = 0;
      filterSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
      pixiApp.stage.addChild(filterSprite);
      pixiApp.stage.filters = [ filter ];
      this.resizeHandler();
    }
    $wrap.appendChild(renderer.view);
    window.addEventListener('resize', this.resizeHandler);
  }
  componentDidUpdate(prevProps) {
    const { activeSlide, slides } = this.props;
    if(activeSlide === prevProps.activeSlide) {
      return;
    }
    const width = this.ref.current.offsetWidth;
    const height = width / THUMB_RATIO;
    const newTexture = slides[activeSlide];
    const oldSprite = slidesContainer.children[0];
    const newSprite = scaleSprite(new PIXI.Sprite(newTexture), width, height);
    newSprite.alpha = 0;
    slidesContainer.addChild(newSprite);
    const tl = new TimelineLite();
    tl.to(filter.scale, .5, {
      x: 100,
      y: 100,
      ease: 'linear',
    });
  }
  resizeHandler() {
    const { slides, activeSlide } = this.props;
    const width = this.ref.current.offsetWidth;
    const height = width / THUMB_RATIO;
    const texture = slides[activeSlide];
    clearContainer(slidesContainer);
    const sprite = scaleSprite(new PIXI.Sprite(texture), width, height);  
    slidesContainer.addChild(sprite);
    pixiApp.renderer.resize(width, height);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler);
  }
  render() {
    const { activeSlide } = this.props;
    return (
      <div className="projects--thumb" ref={this.ref}>
      </div>
    )
  }
}

const mapStateToProps = ({ activeSlide, slides }) => ({
  activeSlide,
  slides,
});
export default connect(mapStateToProps, null)(Thumb);
