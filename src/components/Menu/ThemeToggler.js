import React, {useState, useEffect, useRef} from 'react';
import {theme as pixiTheme} from '@/pixi';
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
    //__ee__.emit('change_theme', theme);
    const bounds = ref.current.getBoundingClientRect();
    const mask = theme === 'dark' ? pixiTheme.lightMask : pixiTheme.darkMask;
    const anotherMask =
      theme === 'dark' ? pixiTheme.darkMask : pixiTheme.lightMask;
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
        const {children} = pixiTheme.stage;
        const len = children.length;
        const hiddenIndex = len - 2;
        const visibleIndex = len - 1;
        const hiddenSprite = children[hiddenIndex];
        const visibleSprite = children[visibleIndex];

        mask.scale.set(0, 0);
        visibleSprite.mask = null;

        anotherMask.scale.set(0, 0);
        hiddenSprite.mask = anotherMask;
        pixiTheme.stage.children.splice(hiddenIndex, 1);
        pixiTheme.stage.children.push(hiddenSprite);

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
