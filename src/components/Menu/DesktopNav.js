import React, {useEffect, useRef, useCallback} from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import TweenLite from 'gsap/TweenLite';
import Hoverable from '@/components/Hoverable';
import {RESIZE_DELAY} from '@/constants';
import routes from './routes';
import dict from '@/translations';
import {Link} from 'react-router-dom';
import throttle from 'lodash.throttle';
import {Expo} from 'gsap/EasePack';

const DesktopNav = props => {
  const ref = useRef();
  const lineRef = useRef();
  const onResize = useCallback(
    throttle(() => {
      updateBottomLine(false);
    }, RESIZE_DELAY),
    [],
  );
  useEffect(() => {
    window.addEventListener('resize', onResize);
    props.history.listen(_ => {
      updateBottomLine();
    });
    // give browser some time to calc positions
    setTimeout(() => updateBottomLine(false), 275);

    const $wrap = ref.current;
    const $lis = [].slice.call(document.querySelectorAll('li'));
    const resizeObserver = new ResizeObserver(_ => updateBottomLine(false));
    $lis.forEach($el => resizeObserver.observe($el));
    return () => {
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
    };
  }, []);
  const updateBottomLine = (needAnimation = true) => {
    const $wrap = ref.current;
    const $line = lineRef.current;
    if (!$wrap || !$line) return;
    const route = props.history.location.pathname;
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
  };
  const activePath = window.location.pathname;
  return (
    <>
      <span
        ref={lineRef}
        className="top-menu--bottom-line"
        role="presentation"
      />
      <nav className="desktop-nav" ref={ref}>
        <ul>
          {routes.map(function({path, translationKey}) {
            return (
              <li
                key={path}
                data-path={path}
                className={activePath === path ? 'is-active' : ''}>
                <Hoverable>
                  <Link className="theme-dependent" to={path}>
                    {dict[translationKey][props.lang]}
                  </Link>
                </Hoverable>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};
export default DesktopNav;
