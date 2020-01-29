import './index.less';
import React, {PureComponent, useState} from 'react';
import Thumb from './Thumb';
import {connect} from 'react-redux';
import projectsList from '@/projects';
import Text from './Text';
import InputEvents from './InputEvents';
import dict from '@/translations';
import {
  prevSlide,
  nextSlide,
  animationEnd,
  animationStart,
} from '@/store/slice/portfolio';
import Counter from './Counter';
import Hoverable from '@/components/Hoverable';
import cn from 'classnames';

const Works = props => {
  const {lang, activeSlide, theme} = props;
  if (!props.slidesLoaded) {
    return null;
  }
  const project = projectsList[activeSlide];
  const {title, desc} = project;
  const isDark = theme === 'light';
  return (
    <section className="works">
      <InputEvents next={props.nextSlide} prev={props.prevSlide} />
      <div className="works--container">
        <Thumb
          activeSlide={props.activeSlide}
          animationEnd={props.animationEnd}
          animationStart={props.animationStart}
          nextSlide={props.nextSlide}
          prevSlide={props.prevSlide}
        />
        <Text isDark={isDark} title={title[lang]} desc={desc[lang]} />
        <div className="works--nav">
          <div className="works--controls">
            <Hoverable areaX={70} areaY={70} magnet>
              <button
                onClick={props.prevSlide}
                aria-label={dict.prev_slide[lang]}
                id="prev-work-btn"
                className={cn(
                  'works--prev',
                  'theme-dependent',
                  isDark && 'is-dark',
                )}>
                <i className="icon-angle-left"></i>
              </button>
            </Hoverable>
            <Hoverable areaX={70} areaY={70} magnet>
              <button
                onClick={props.nextSlide}
                id="next-work-btn"
                aria-label={dict.next_slide[lang]}
                className={cn(
                  'works--next',
                  'theme-dependent',
                  isDark && 'is-dark',
                )}>
                <i className="icon-angle-right"></i>
              </button>
            </Hoverable>
          </div>
          <Hoverable>
            <div className="works--link">
              <a
                className={cn('theme-dependent', isDark && 'is-dark')}
                href={project.link}
                aria-label={title[lang]}
                target="_blank">
                {dict.watch[lang]}
                <i className="icon-link-ext"></i>
              </a>
            </div>
          </Hoverable>
          <Counter
            isDark={isDark}
            count={projectsList.length}
            active={activeSlide + 1}
          />
        </div>
      </div>
    </section>
  );
};

const mapState = ({portfolio, lang, theme}) => ({
  lang,
  activeSlide: portfolio.activeSlide,
  isAnimating: portfolio.animating,
  slidesLoaded: portfolio.slidesLoaded,
  theme,
});
const mapDispatch = dispatch => ({
  prevSlide: () => dispatch(prevSlide()),
  nextSlide: () => dispatch(nextSlide()),
  animationEnd: () => dispatch(animationEnd()),
  animationStart: () => dispatch(animationStart()),
});
export default connect(
  mapState,
  mapDispatch,
)(Works);
