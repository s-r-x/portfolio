import React, { PureComponent } from 'react'
import TimelineLite from 'gsap/TimelineLite';
import TweenLite from 'gsap/TweenLite';
import { Expo, Sine } from 'gsap/EasePack';

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
    if(prevProps === this.props) {
      return;
    }
    const $title = this.title.current;
    const $desc = this.desc.current;
    const tl = new TimelineLite();
    const th = this;
    const ease = Sine.easeOut;
    const from = { opacity: 0, y: -13, };
    const to = { opacity: 1, y: 0, };
    const offset = .12;
    const time = .325;
    // title
    tl.to($title, time, {
      ...from,
      ease,
      onComplete() {
        $title.innerHTML = th.props.title.replace(' ', '</br>');
      }
    })
    tl.to($title, time, {
      ...to,
      ease,
    }, time)
    // desc
    tl.to($desc, time, {
      ...from,
      ease,
      onComplete() {
        $desc.textContent = th.props.desc;
      }
    }, offset)
    tl.to($desc, time, {
      ...to,
      ease,
    }, time + offset)
  }
  render() {
    return( 
      <div className="works--text">
        <h2 className="works--title" ref={this.title}></h2>
        <p className="works--desc" ref={this.desc}></p>
      </div>
    )
  }
}

export default Text;
