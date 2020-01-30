import React, {useState, useEffect, useRef} from 'react';
import pixiTheme from '@/pixi/theme';
import TweenLite from 'gsap/TweenLite';
import {Vector} from 'contra.js';
import Hoverable from '@/components/Hoverable';

const ThemeToggler = props => {
  const [theme, setTheme] = useState('dark');
  const [changing, setChanging] = useState(false);
  const ref = useRef();
  const toggleTheme = () => {
    setChanging(true);
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    const bounds = ref.current.getBoundingClientRect();
    const mask = pixiTheme.activeMask;
    const maskPos = new Vector(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    );
    mask.x = maskPos.x;
    mask.y = maskPos.y;
    const dist = maskPos.dist(new Vector(0, window.innerHeight));
    const scale = Math.ceil(dist / pixiTheme.MASK_RADIUS);

    const targets = [].slice
      .call(document.querySelectorAll('.theme-dependent'))
      .map($el => {
        const rect = $el.getBoundingClientRect();
        return {
          $el,
          maskDist: new Vector(rect.x + rect.width, rect.y).dist(maskPos),
        };
      });
    TweenLite.to(mask.scale, 0.7, {
      x: scale,
      y: scale,
      onUpdate() {
        const radius = mask.width / 2;
        let i = targets.length;
        while (i--) {
          const {$el, maskDist} = targets[i];
          if (maskDist < radius) {
            if (newTheme === 'dark') {
              $el.classList.remove('is-dark');
              targets.splice(i, 1);
            } else {
              $el.classList.add('is-dark');
              targets.splice(i, 1);
            }
          }
        }
      },
      onComplete() {
        setChanging(false);
        pixiTheme.swapBgs();
        pixiTheme.theme = newTheme;
        props.changeTheme(newTheme);
      },
    });
  };
  return (
    <Hoverable areaX={50} areaY={50} magnet>
      <button
        className="theme-dependent"
        ref={ref}
        disabled={changing}
        onClick={toggleTheme}>
        {theme === 'light' ? (
          <i className="icon-moon" />
        ) : (
          <i className="icon-sun" />
        )}
      </button>
    </Hoverable>
  );
};
export default ThemeToggler;
