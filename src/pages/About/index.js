import React, {PureComponent} from 'react';
import './index.less';
import {connect} from 'react-redux';
import dict from '../../translations';
import {mapNumber, isMobile} from '../../utils';
import TweenLite from 'gsap/TweenLite';
const MIN = 35;
const MAX = -MIN;

class AboutPage extends PureComponent {
  constructor() {
    super();
    this.ref = React.createRef();
    this.mousemove = this.mousemove.bind(this);
  }
  componentDidMount() {
    if (!isMobile) {
      document.addEventListener('mousemove', this.mousemove);
    }
  }
  componentWillUnmount() {
    document.removeEventListener('mousemove', this.mousemove);
  }
  mousemove({clientX, clientY}) {
    const valY = mapNumber(clientX, 0, window.innerWidth, MIN, MAX);
    const valX = mapNumber(clientY, window.innerHeight, 0, MIN, MAX);
    TweenLite.to(this.ref.current, 0.5, {
      rotationY: valY,
      rotationX: valX,
    });
  }
  render() {
    const {lang} = this.props;
    return (
      <section className="about">
        <div className="about--inner">
          <div className="about--left">
            <h2 ref={this.ref}>{dict.about_hello[lang]}</h2>
          </div>
          <div className="about--right">
            <p>{dict.about_first_p[lang]}</p>
            <p>{dict.about_second_p[lang]}</p>
            <div className="about--links">
              <a href="tg://resolve?domain=srx90">Telegram</a>
              <a href="skype:ilyastrus?add">Skype</a>
              <a href="https://github.com/s-r-x" target="_blank">
                Github
              </a>
              <a href="mailto:strax1990@gmail.com">Email</a>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = ({lang}) => ({
  lang,
});
export default connect(
  mapStateToProps,
  null,
)(AboutPage);
