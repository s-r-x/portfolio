import React from 'react';
import './index.less';
import {Link} from 'react-router-dom';
import dict from '@/translations';
import {connect} from 'react-redux';
import {changeLang} from '@/store/slice/lang';
import {openMenu, closeMenu} from '@/store/slice/menu';
import {RESIZE_DELAY} from '@/constants';
import {withRouter} from 'react-router-dom';
import ThemeToggler from './ThemeToggler';
import LangToggler from './LangToggler';
import {changeTheme} from '@/store/slice/theme';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import useMedia from 'use-media';
import Hamburger from './Hamburger';
import {CSSTransition} from 'react-transition-group';

const Menu = props => {
  const {lang} = props;
  const isDesktop = useMedia({minWidth: '731px'});
  return (
    <div className="top-menu">
      <div className="top-menu--left">
        {!isDesktop && (
          <Hamburger
            open={props.openMenu}
            close={props.closeMenu}
            isOpen={props.isMobileOpen}
          />
        )}
        <Link
          to="/"
          className="home-link"
          aria-label={dict.homelink_label[lang]}>
          <div role="img" aria-label="logo" className="logo theme-dependent" />
        </Link>
      </div>
      {isDesktop && <DesktopNav lang={lang} history={props.history} />}
      <CSSTransition
        unmountOnExit
        in={!isDesktop && props.isMobileOpen}
        timeout={500}
        classNames="my-node">
        {<MobileNav lang={lang} />}
      </CSSTransition>
      <div className="top-menu--right">
        <div className="theme-toggler">
          <ThemeToggler changeTheme={props.changeTheme} />
        </div>
        <LangToggler lang={lang} changeLang={props.changeLang} />
      </div>
    </div>
  );
};

const mapState = ({lang, menu}) => ({
  lang,
  isMobileOpen: menu.isOpen,
});
const mapDispatch = dispatch => ({
  changeLang: lang => dispatch(changeLang(lang)),
  changeTheme: theme => dispatch(changeTheme(theme)),
  openMenu: () => dispatch(openMenu()),
  closeMenu: () => dispatch(closeMenu()),
});

export default withRouter(
  connect(
    mapState,
    mapDispatch,
  )(Menu),
);
