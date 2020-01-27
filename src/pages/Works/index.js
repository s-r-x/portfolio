import './index.less';
import React, {PureComponent, useState} from 'react';
import Thumb from './Thumb';
import {connect} from 'react-redux';
import projectsList from '@/projects';
import Text from './Text';
import InputEvents from './InputEvents';
import dict from '@/translations';
import {prevSlide, nextSlide, animationEnd} from '@/store/slice/portfolio';

const Works = props => {
  const {lang, activeSlide} = props;
  if (!props.slidesLoaded) {
    return null;
  }
  const project = projectsList[activeSlide];
  const {title, desc} = project;
  return (
    <section className="works">
      <InputEvents next={props.nextSlide} prev={props.prevSlide} />
      <div className="works--container">
        <Thumb
          activeSlide={props.activeSlide}
          animationEnd={props.animationEnd}
          nextSlide={props.nextSlide}
          prevSlide={props.prevSlide}
        />
        <Text title={title[lang]} desc={desc[lang]} />
        <div className="works--nav">
          <div className="works--controls">
            <button
              onClick={props.prevSlide}
              aria-label={dict.prev_slide[lang]}
              id="prev-work-btn"
              className="works--prev">
              <i className="icon-angle-left"></i>
            </button>
            <button
              onClick={props.nextSlide}
              className="works--next"
              id="next-work-btn"
              aria-label={dict.next_slide[lang]}>
              <i className="icon-angle-right"></i>
            </button>
          </div>
          <div className="works--link">
            <a href={project.link} aria-label={title[lang]} target="_blank">
              {dict.watch[lang]}
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
  );
};

const mapState = ({portfolio, lang}) => ({
  lang,
  activeSlide: portfolio.activeSlide,
  isAnimating: portfolio.animating,
  slidesLoaded: portfolio.slidesLoaded,
});
const mapDispatch = dispatch => ({
  prevSlide: () => dispatch(prevSlide()),
  nextSlide: () => dispatch(nextSlide()),
  animationEnd: () => dispatch(animationEnd()),
});
export default connect(
  mapState,
  mapDispatch,
)(Works);
