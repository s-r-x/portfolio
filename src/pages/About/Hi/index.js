import React, {useRef, useEffect, useState, memo} from 'react';
import * as PIXI from 'pixi.js';
import TweenLite from 'gsap/TweenLite';
import {Expo} from 'gsap/EasePack';
import debounce from 'lodash.debounce';
import './index.less';
import {clearContainer, wait} from '@/utils';
import Particle from './Particle';
import chunk from 'lodash.chunk';
import {loadFont, createParticles, createTextureFromText} from './utils';
import {TEXT_TOP_OFFSET, ACTIVE_CANVAS_BREAKPOINT} from './constants';
import {renderer, ticker} from '@/pixi';

const {
  RenderTexture,
  Container,
  Sprite,
  ParticleContainer,
  Rectangle,
  Text,
  TextStyle,
} = PIXI;

// TODO:: hide pixi canvas on resize < 1100px
//
let particleUpdater;
let isFirstLoad = true;
const WAIT_FIRST_LOAD = 800;
const WAIT_LOADED = 500;
const RESIZE_DELAY = 250;
let stage;

const Hi = memo(({text}) => {
  const ref = useRef();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [show, setShow] = useState(false);
  const renderText = () => {
    const $wrap = ref.current;
    stage = new Container();
    if (particleUpdater) {
      ticker.remove(particleUpdater);
    }
    clearContainer(stage);
    const rt = createTextureFromText({text, renderer});
    const container = createParticles({
      pixels: chunk(renderer.extract.pixels(rt), 4),
      texture: rt,
    });
    const width = $wrap.offsetWidth,
      height = $wrap.offsetHeight;
    const {x: descX, y: descY, height: descHeight} = document
      .querySelector('.about--right')
      .getBoundingClientRect();
    stage.addChild(container);
    stage.x = descX - rt.width - 30;
    stage.y = descY + descHeight / 2 - rt.height / 2.5;
    particleUpdater = () => {
      const {x, y} = renderer.plugins.interaction.mouse.global;
      container.children.forEach(p => {
        p.__update(x - stage.x, y - stage.y);
      });
      renderer.render(stage);
    };
    ticker.add(particleUpdater);
    setShow(true);
  };
  const onResize = debounce(() => {
    renderText();
  }, RESIZE_DELAY);
  useEffect(() => {
    loadFont(() => setFontLoaded(true));
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
  return <div className={show ? 'hi visible' : 'hi'} ref={ref} />;
});

export default Hi;
