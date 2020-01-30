import React, {useEffect, useRef} from 'react';
import {rootStage, renderer} from '@/pixi';
import {Container, Graphics} from 'pixi.js';
import TweenLite from 'gsap/TweenLite';
import {
  CURSOR_RADIUS as RADIUS,
  ACCENT_COLOR as COLOR,
  IS_MOBILE,
} from '@/constants';

const SCREEN_OFFSET = -50;
let border, circle, container;
const Cursor = props => {
  const circleRef = useRef();
  const onLinkEnter = () => {
    TweenLite.to(circleRef.current.scale, 0.25, {
      x: 1,
      y: 1,
    });
  };
  const onLinkLeave = () => {
    TweenLite.to(circleRef.current.scale, 0.25, {
      x: 0,
      y: 0,
    });
  };
  useEffect(() => {
    if (IS_MOBILE) return;
    container = new Container();
    border = new Graphics();
    border.lineStyle(2, COLOR, 1, 0);
    border.drawCircle(0, 0, RADIUS);
    container.addChild(border);
    circle = new Graphics();
    circle.beginFill(COLOR);
    circle.drawCircle(0, 0, RADIUS);
    circle.endFill();
    circle.scale.set(0, 0);
    circleRef.current = circle;
    container.addChild(circle);
    container.x = SCREEN_OFFSET;
    rootStage.addChild(container);
    window.addEventListener('mousemove', e => {
      TweenLite.to(container, 0.25, {
        x: e.clientX,
        y: e.clientY,
      });
    });

    __ee__.on('mouse_enter/link', onLinkEnter);
    __ee__.on('mouse_leave/link', onLinkLeave);
  }, []);
  return null;
};

export default Cursor;
