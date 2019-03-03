import './index.less';
import React, { PureComponent } from 'react'
import { THUMBS_BASE_URL } from '../../constants';
import Thumb from './Thumb';
import * as PIXI from 'pixi.js';
import { connect } from 'react-redux';
import projectsList from '../../projects';
import Text from './Text';
import dict from '../../translations';
import { prevSlide, nextSlide } from '../../actions/creators';

class Works extends PureComponent {
  constructor() {
    super();
    this.nextHandler = this.nextHandler.bind(this);
    this.prevHandler = this.prevHandler.bind(this);
    this.wheelListener = this.wheelListener.bind(this);
    this.keystrokeListener = this.keystrokeListener.bind(this);
  }
  componentDidMount() {
    window.addEventListener('wheel', this.wheelListener);
    window.addEventListener('keydown', this.keystrokeListener);
  }
  initHammer() {
    console.log(Hammer);
    setTimeout(() => console.log(document.querySelector('.works--thumb')), 1000);
  }
  componentWillUnmount() {
    window.removeEventListener('wheel', this.wheelListener);
    window.removeEventListener('keydown', this.keystrokeListener);
  }
  // TODO:: dry
  nextHandler() {
    this.props.nextSlide();
  }
  prevHandler() {
    this.props.prevSlide();
  }
  wheelListener({ deltaY }) {
    if(deltaY > 0) {
      this.nextHandler();
    }
    else if(deltaY < 0) {
      this.prevHandler();
    }
  }
  keystrokeListener({ keyCode }) {
    const ARROW_LEFT = 37;
    const ARROW_RIGHT = 39;
    const ARROW_TOP = 38;
    const ARROW_BOTTOM = 40;
    switch(keyCode) {
      case ARROW_LEFT:
      case ARROW_TOP:
        this.prevHandler();
        break;
      case ARROW_RIGHT:
      case ARROW_BOTTOM:
        this.nextHandler();
        break;
      default:
        null;
    }
  }
  render() {
    const { lang, activeSlide } = this.props;
    if(activeSlide === null) {
      return false;
    }
    const project = projectsList[activeSlide];
    const { title, desc } = project;
    return (
      <section className="works">
        <div className="works--container">
          <Thumb/>
          <Text title={title[lang]} desc={desc[lang]}/>
          <div className="works--nav">
            <div className="works--controls">
              <button 
                onClick={this.prevHandler}
                aria-label={dict.prev_slide[lang]} 
                id="prev-work-btn"
                className="works--prev">
                <i className="icon-angle-left"></i>
              </button>
              <button 
                onClick={this.nextHandler}
                className="works--next"
                id="next-work-btn"
                aria-label={dict.next_slide[lang]}>
                <i className="icon-angle-right"></i>
              </button>
            </div>
            <div className="works--link">
              <a href={project.link} aria-label={title[lang]} target="_blank">{dict.watch[lang]}
              <i className="icon-link-ext"></i>
              </a>
            </div>
            <div className="works--count">
              <span className="works--count-active">{activeSlide + 1}</span>
              <span className="works--count-del">-</span>
              <span className="works--count-overall">{projectsList.length}</span>
            </div>   
          </div>
        </div>
      </section>
    )
  }
}

const mapStateToProps = ({ lang, activeSlide, isAnimating }) => ({
  lang,
  activeSlide,
  isAnimating,
});
const mapDispatchToProps = (dispatch) => ({
  prevSlide: () => dispatch(prevSlide()),
  nextSlide: () => dispatch(nextSlide()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Works);
