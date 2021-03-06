import React, {useCallback, useRef} from 'react';
import './index.less';
import TweenLite from 'gsap/TweenLite';
import {Vector, toDeg} from 'contra.js';
import {IS_MOBILE} from '@/constants';

const Hoverable = props => {
  const ref = useRef();
  const childRef = useRef();
  // props radius x radius y
  const onMouseEnter = useCallback(() => {
    if (IS_MOBILE) return;
    __ee__.emit(props.event);
    if (props.magnet) {
      window.addEventListener('mousemove', onMouseMove);
    }
  }, []);
  const onMouseLeave = useCallback(() => {
    if (IS_MOBILE) return;
    __ee__.emit(props.leaveEvent);
    if (props.magnet) {
      window.removeEventListener('mousemove', onMouseMove);
      TweenLite.to(childRef.current, 0.3, {
        x: 0,
        y: 0,
      });
    }
  }, []);
  const onMouseMove = useCallback(({clientX, clientY}) => {
    if (IS_MOBILE) return;
    const {x, y, width, height} = childRef.current.getBoundingClientRect();
    const mouse = new Vector(clientX, clientY);
    const child = new Vector(x + width / 2, y + height / 2);
    const diff = mouse.subtract(child);
    TweenLite.to(childRef.current, 0.4, {
      x: diff.x,
      y: diff.y,
    });
  }, []);
  return (
    <div
      ref={ref}
      style={props.style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="hoverable">
      <div
        style={{
          width: props.areaX ? props.areaX + 'px' : '100%',
          height: props.areaY ? props.areaY + 'px' : '100%',
        }}
        className="hoverable-area"
      />
      <div ref={childRef} className="hoverable-children">
        {props.children}
      </div>
    </div>
  );
};
Hoverable.defaultProps = {
  event: 'mouse_enter/link',
  leaveEvent: 'mouse_leave/link',
  style: {},
  magnet: false,
};

export default Hoverable;
