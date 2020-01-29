import React, {PureComponent} from 'react';
import TimelineLite from 'gsap/TimelineLite';
import TweenLite from 'gsap/TweenLite';
import {Expo, Sine} from 'gsap/EasePack';
import cn from 'classnames';

class Text extends PureComponent {
  constructor(props) {
    super(props);
    this.title = React.createRef();
    this.desc = React.createRef();
  }
  componentDidMount() {
    this.title.current.textContent = this.props.title;
    this.desc.current.textContent = this.props.desc;
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.title === this.props.title &&
      prevProps.desc === this.props.desc
    ) {
      return;
    }
    const $title = this.title.current;
    const $desc = this.desc.current;
    const tl = new TimelineLite();
    const th = this;
    const ease = Sine.easeOut;
    const from = {opacity: 0, y: -13};
    const to = {opacity: 1, y: 0};
    const offset = 0.12;
    const time = 0.325;
    // title
    tl.to($title, time, {
      ...from,
      ease,
      onComplete() {
        $title.innerHTML = th.props.title.replace(' ', '</br>');
      },
    });
    tl.to(
      $title,
      time,
      {
        ...to,
        ease,
      },
      time,
    );
    // desc
    tl.to(
      $desc,
      time,
      {
        ...from,
        ease,
        onComplete() {
          $desc.textContent = th.props.desc;
        },
      },
      offset,
    );
    tl.to(
      $desc,
      time,
      {
        ...to,
        ease,
      },
      time + offset,
    );
  }
  render() {
    return (
      <div className="works--text">
        <h2 className="works--title" ref={this.title}></h2>
        <p
          className={cn(
            'works--desc',
            'theme-dependent',
            this.props.isDark && 'is-dark',
          )}
          ref={this.desc}></p>
      </div>
    );
  }
}

export default Text;
