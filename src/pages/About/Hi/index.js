import React, {useRef, useEffect, useState} from 'react';
import * as PIXI from 'pixi.js';
import TweenLite from 'gsap/TweenLite';
import {Expo} from 'gsap/EasePack';
import debounce from 'lodash.debounce';
import './index.less';
const {Text, TextStyle} = PIXI;
import {clearContainer, wait} from '../../../utils';
import Particle from './Particle';
import chunk from 'lodash.chunk';
import {loadFont, createParticles, createTextureFromText} from './utils';

const {RenderTexture, Container, Sprite, ParticleContainer, Rectangle} = PIXI;

const pixiApp = new PIXI.Application({
  autoResize: true,
  pixelRatio: window.devicePixelRatio,
  transparent: true,
});
pixiApp.ticker.stop();
let particleUpdater;
let isFirstLoad = true;
const WAIT_FIRST_LOAD = 800;
const WAIT_LOADED = 500;
const RESIZE_DELAY = 250;

const Hi = ({text}) => {
  const ref = useRef();
  const [fontLoaded, setFontLoaded] = useState(false);
  const renderText = () => {
    const $wrap = ref.current;
    const {renderer, stage, ticker} = pixiApp;
    if (particleUpdater) {
      ticker.remove(particleUpdater);
    }
    clearContainer(stage);
    const rt = createTextureFromText({text, renderer});
    const container = createParticles({
      pixels: chunk(pixiApp.renderer.extract.pixels(rt), 4),
      texture: rt,
    });
    stage.addChild(container);
    const width = $wrap.offsetWidth,
      height = $wrap.offsetHeight;
    renderer.resize(width, height);
    const {x: descX} = document
      .querySelector('.about--right')
      .getBoundingClientRect();
    container.x = descX - rt.width;
    container.y = (height - 170) / 2 + rt.height / 2;
    particleUpdater = () => {
      const {x, y} = renderer.plugins.interaction.mouse.global;
      //if(x > container.x && x < container.x + rt.width && y > container.y && y < container.y + rt.height) {
      //container.children.forEach(p =>
      //  p.__update(x - container.x, y - container.y),
      //);
      //}
    };
    ticker.add(particleUpdater);
    pixiApp.ticker.start();
  };
  const onResize = debounce(() => {
    renderText();
  }, RESIZE_DELAY);
  useEffect(() => {
    loadFont(() => setFontLoaded(true));
  }, []);
  useEffect(() => {
    if (fontLoaded) {
      const $wrap = ref.current;
      const {renderer, stage} = pixiApp;
      wait(isFirstLoad ? WAIT_FIRST_LOAD : WAIT_LOADED).then(() => {
        isFirstLoad = false;
        $wrap.appendChild(renderer.view);
        renderText();
        window.removeEventListener('resize', onResize);
        window.addEventListener('resize', onResize);
      });
      return () => {
        pixiApp.ticker.stop();
        if (particleUpdater) {
          pixiApp.ticker.remove(particleUpdater);
        }
        clearContainer(stage);
        window.removeEventListener('resize', onResize);
      };
    }
  }, [text, fontLoaded]);
  return <div className="hi" ref={ref} />;
};

export default Hi;
