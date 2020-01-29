import React, {useRef, useEffect, useState, memo} from 'react';
import * as PIXI from 'pixi.js';
import debounce from 'lodash.debounce';
import './index.less';
import {clearContainer, wait} from '@/utils';
import Particle from './Particle';
import chunk from 'lodash.chunk';
import {loadFont, createParticles, createTextureFromText} from './utils';
import {TEXT_TOP_OFFSET, ACTIVE_CANVAS_BREAKPOINT} from './constants';
import {renderer, ticker, aboutStage as stage} from '@/pixi';
import TweenLite from 'gsap/TweenLite';
import {Expo} from 'gsap/EasePack';
import random from 'lodash.random';

const {
  RenderTexture,
  Sprite,
  ParticleContainer,
  Rectangle,
  Text,
  TextStyle,
  Graphics,
} = PIXI;

// TODO:: hide pixi canvas on resize < 1100px
//
let particleUpdater;
let isFirstLoad = true;
const WAIT_FIRST_LOAD = 1000;
const WAIT_LOADED = 600;
const RESIZE_DELAY = 250;

let container, mask;
const Hi = memo(({text}) => {
  const ref = useRef();
  const [fontLoaded, setFontLoaded] = useState(false);
  //const [preventInteraction, setPreventInteraction] = useState(false);
  const renderText = () => {
    const $wrap = ref.current;
    if (particleUpdater) {
      ticker.remove(particleUpdater);
    }
    clearContainer(stage);
    const rt = createTextureFromText({text, renderer});
    container = createParticles({
      pixels: chunk(renderer.extract.pixels(rt), 4),
      texture: rt,
    });
    const width = $wrap.offsetWidth,
      height = $wrap.offsetHeight;
    const {x: descX, y: descY, height: descHeight} = document
      .querySelector('.about--right')
      .getBoundingClientRect();
    stage.addChild(container);
    const RAD = 5;
    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawCircle(0, 0, RAD);
    mask = graphics;
    stage.addChild(mask);
    stage.mask = mask;
    stage.x = descX - rt.width - 30;
    stage.y = descY + descHeight / 2 - rt.height / 2.5;
    particleUpdater = () => {
      const {x, y} = renderer.plugins.interaction.mouse.global;
      container.children.forEach(p => {
        p.__update(x - stage.x, y - stage.y);
      });
    };
    ticker.add(particleUpdater);
    mask.x = rt.width / 2 - RAD / 2;
    mask.y = descHeight / 2 - RAD / 2;
    TweenLite.to(mask.scale, 1.2, {
      x: 80,
      y: 80,
      //ease: Expo.easeInOut,
    });
  };
  const playExit = () => {
    ticker.remove(particleUpdater);
    if (particleUpdater) {
      ticker.remove(particleUpdater);
    }
    if (mask) {
      TweenLite.to(mask.scale, 0.6, {
        x: 0,
        y: 0,
        //ease: Expo.easeIn,
      });
    }
  };
  const onResize = debounce(() => {
    renderText();
  }, RESIZE_DELAY);
  useEffect(() => {
    loadFont(() => {
      setFontLoaded(true);
    });
    __ee__.on('transition/about_exit', playExit);
    return () => {
      __ee__.off('transition/about_exit', playExit);
    };
  }, []);
  useEffect(() => {
    if (fontLoaded && ref.current.offsetWidth > ACTIVE_CANVAS_BREAKPOINT) {
      const $wrap = ref.current;
      wait(isFirstLoad ? WAIT_FIRST_LOAD : WAIT_LOADED).then(() => {
        isFirstLoad = false;
        renderText();
        window.removeEventListener('resize', onResize);
        window.addEventListener('resize', onResize);
      });
      return () => {
        if (particleUpdater) {
          ticker.remove(particleUpdater);
        }
        clearContainer(stage);
        window.removeEventListener('resize', onResize);
      };
    }
  }, [text, fontLoaded]);
  return <div className="hi visible" ref={ref} />;
});

export default Hi;
