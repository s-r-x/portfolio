import React from 'react';
import {Transition, TransitionGroup} from 'react-transition-group';
import TweenLite from 'gsap/TweenLite';
import {Expo} from 'gsap/EasePack';
import TimelineLite from 'gsap/TimelineLite';
import {portfolioStage} from '@/pixi';

const TIMEOUT = 1200;
const DURATION = 0.6;
const DELAY = DURATION;
const ease = Expo.easeIn;
function reset(node) {
  TweenLite.set(node, {
    opacity: 0,
  });
}
function playPortfolio(node) {
  reset(node);
  const tl = new TimelineLite();
  tl.to(
    node,
    DURATION,
    {
      opacity: 1,
      ease,
    },
    DELAY,
  );
}
function playAbout(node) {
  const tl = new TimelineLite();
  const $border = node.querySelector('.about--border');
  const $content = node.querySelector('.about--content');
  tl.set($border, {height: 0});
  tl.set($content, {y: '100%'});
  tl.to($border, DURATION, {
    height: '100%',
    ease: Expo.easeOut,
  }).to(
    $content,
    DURATION,
    {
      y: '0%',
      ease: Expo.easeOut,
    },
    0,
  );
}
function playMessage(node) {
  console.log('playMessage');
}
function play(pathname, node) {
  switch (pathname) {
    case '/':
      return playPortfolio(node);
    case '/about':
      return playAbout(node);
    case '/message':
      return playMessage(node);
  }
}

function exitPortfolio(node) {
  __ee__.emit('transition/portfolio_exit');
  const tl = new TimelineLite();
  TweenLite.to(node, DURATION, {
    opacity: 0,
  });
}
function exitAbout(node) {
  const tl = new TimelineLite();
  const $border = node.querySelector('.about--border');
  const $content = node.querySelector('.about--content');
  tl.to($border, DURATION, {
    height: 0,
    ease,
  }).to(
    $content,
    DURATION,
    {
      y: '100%',
      ease,
    },
    0,
  );
  __ee__.emit('transition/about_exit');
}
function exitMessage(node) {}
function playExit(pathname, node) {
  switch (pathname) {
    case '/':
      return exitPortfolio(node);
    case '/about':
      return exitAbout(node);
    case '/message':
      return exitMessage(node);
  }
}
class RouteTransitions extends React.Component {
  shouldComponentUpdate({pathname}) {
    return this.props.pathname !== pathname;
  }
  render() {
    const {props} = this;
    return (
      <div className="switch-wrapper">
        <TransitionGroup component={null}>
          <Transition
            key={props.routeKey}
            appear={false}
            onEnter={(node, appears) => play(props.pathname, node, appears)}
            onExit={(node, appears) => playExit(props.pathname, node, appears)}
            timeout={{enter: TIMEOUT, exit: TIMEOUT}}>
            {props.children}
          </Transition>
        </TransitionGroup>
      </div>
    );
  }
}
export default RouteTransitions;
