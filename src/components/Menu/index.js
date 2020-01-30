import React, {PureComponent} from 'react';
import './index.less';
import logo from '@/images/srx_logo_white.svg';
import {Link} from 'react-router-dom';
import dict from '@/translations';
import {connect} from 'react-redux';
import {changeLang} from '@/store/slice/lang';
import TweenLite from 'gsap/TweenLite';
import {Expo} from 'gsap/EasePack';
import {RESIZE_DELAY} from '@/constants';
import throttle from 'lodash.throttle';
import ResizeObserver from 'resize-observer-polyfill';
import {withRouter} from 'react-router-dom';
import Hoverable from '@/components/Hoverable';
import ThemeToggler from './ThemeToggler';
import {changeTheme} from '@/store/slice/theme';

const routes = [
  {path: '/', translationKey: 'menu_works'},
  {path: '/message', translationKey: 'menu_message'},
  {path: '/about', translationKey: 'menu_about'},
];

const Li = ({to, text, isActive}) => {
  return (
    <li data-path={to} className={isActive ? 'is-active' : ''}>
      <Hoverable>
        <Link className="theme-dependent" to={to}>
          {text}
        </Link>
      </Hoverable>
    </li>
  );
};

class Menu extends PureComponent {
  constructor() {
    super();
    this.ref = React.createRef();
    this.lineRef = React.createRef();
    this.updateBottomLine = this.updateBottomLine.bind(this);
  }
  componentDidMount() {
    this.props.history.listen(_ => {
      this.forceUpdate();
      this.updateBottomLine();
    });
    const $wrap = this.ref.current;
    // if there is opened mobile menu we need to close it after a link click
    const $lis = [].slice.call(document.querySelectorAll('li'));
    $lis.forEach($li => {
      const $a = $li.querySelector('a');
      $a.addEventListener('click', () => {
        const $ham = document.querySelector('.hamburger');
        if ($ham.classList.contains('is-active')) {
          $ham.classList.remove('is-active');
          $wrap.classList.remove('is-active');
        }
      });
    });
    window.addEventListener(
      'resize',
      throttle(() => this.updateBottomLine(false), RESIZE_DELAY),
    );
    const resizeObserver = new ResizeObserver(_ =>
      this.updateBottomLine(false),
    );
    $lis.forEach($el => resizeObserver.observe($el));
    // give browser some time to calc positions
    setTimeout(() => this.updateBottomLine(false), 275);
  }
  updateBottomLine(needAnimation = true) {
    const $wrap = this.ref.current;
    const $line = this.lineRef.current;
    const route = this.props.history.location.pathname;
    const $li = $wrap.querySelector(`[data-path="${route}"]`);
    const rect = $li.getBoundingClientRect();
    const to = {
      x: rect.left,
      y: rect.top + rect.height,
      width: rect.width,
    };
    if (!needAnimation) {
      TweenLite.set($line, to);
    } else {
      TweenLite.to($line, 0.55, {
        ...to,
        ease: Expo.easeInOut,
      });
    }
  }
  render() {
    const {lang} = this.props;
    const activePath = window.location.pathname;
    return (
      <div className="top-menu" ref={this.ref}>
        <span
          ref={this.lineRef}
          className="top-menu--bottom-line"
          role="presentation"></span>
        <Link
          to="/"
          className="home-link"
          aria-label={dict.homelink_label[lang]}>
          <img src={logo} alt="" className="logo" />
        </Link>
        <nav>
          <ul>
            {routes.map(function({path, translationKey}) {
              return (
                <Li
                  isActive={activePath === path}
                  key={path}
                  to={path}
                  text={dict[translationKey][lang]}
                />
              );
            })}
          </ul>
        </nav>
        <div className="top-menu--right">
          <div className="theme-toggler">
            <ThemeToggler changeTheme={this.props.changeTheme} />
          </div>
          <div className="lang-toggler theme-dependent">
            <Hoverable style={{display: 'inline-block'}}>
              <button
                className={lang === 'en' ? 'is-active' : ''}
                aria-label="Change language to english"
                onClick={() => this.props.changeLang('en')}>
                en{' '}
              </button>
            </Hoverable>
            <span className="delimiter">/</span>
            <Hoverable style={{display: 'inline-block'}}>
              <button
                className={lang === 'ru' ? 'is-active' : ''}
                aria-label="Изменить язык на русский"
                onClick={() => this.props.changeLang('ru')}>
                {' '}
                ru
              </button>
            </Hoverable>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = ({lang}) => ({
  lang,
});
const mapDispatch = dispatch => ({
  changeLang: lang => dispatch(changeLang(lang)),
  changeTheme: theme => dispatch(changeTheme(theme)),
});

export default withRouter(
  connect(
    mapState,
    mapDispatch,
  )(Menu),
);