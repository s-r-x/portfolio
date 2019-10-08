import React, {useRef, useEffect, useState} from 'react';
import * as PIXI from 'pixi.js';
import TweenLite from 'gsap/TweenLite';
import {Expo} from 'gsap/EasePack';
import debounce from 'lodash.debounce';
import './index.less';
const {Text, TextStyle} = PIXI;
import webfont from 'webfontloader';
import {clearContainer, wait} from '../../../utils';
import Particle from './Particle';
import chunk from 'lodash.chunk';

const {RenderTexture, Container, Sprite, ParticleContainer} = PIXI;

const pixiApp = new PIXI.Application({
  autoResize: true,
  pixelRatio: window.devicePixelRatio,
  transparent: true,
});
pixiApp.ticker.stop();
let particleUpdater;

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
    const container = new ParticleContainer(20000);
    stage.addChild(container);
    const textStyle = new TextStyle({
      fontFamily: 'Merriweather',
      fontSize: 48,
      fontSize: 96,
      lineHeight: 41,
      fontWeight: 900,
      letterSpacing: 2,
      fill: 0xffffff,
    });
    const textContainer = new Container();
    textContainer.addChild(new Text(text, textStyle));
    const rt = RenderTexture.create(textContainer.width, textContainer.height);
    renderer.render(textContainer, rt);
    const pixels = chunk(pixiApp.renderer.extract.pixels(rt), 4);
    const SIZE = 2;
    const checkFill = (x, y) => {
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          const index = (y + i) * rt.width + x + i;
          return pixels[index].some(c => c > 0);
        }
      }
    };
    for (let x = 0; x < Math.floor(rt.width / SIZE); x++) {
      for (let y = 0; y < Math.floor(rt.height / SIZE); y++) {
        if (checkFill(x * SIZE, y * SIZE)) {
          const particle = new Particle(SIZE * x, SIZE * y, SIZE, rt);
          container.addChild(particle);
        }
      }
    }
    const width = $wrap.offsetWidth,
      height = $wrap.offsetHeight;
    renderer.resize(width, height);
    const {x: descX} = document
      .querySelector('.about--right')
      .getBoundingClientRect();
    stage.x = descX - rt.width;
    stage.y = (height - 170) / 2 + rt.height / 2;
    //particleUpdater = () => container.children.forEach(p => p.__update());
    ticker.add(particleUpdater);
    console.log(container.children.length);
  };
  const onResize = debounce(() => {
    renderText();
  }, 500);
  useEffect(() => {
    webfont.load({
      google: {
        families: ['Merriweather'],
      },
      active: () => setFontLoaded(true),
    });
  }, []);
  useEffect(() => {
    if (fontLoaded) {
      const $wrap = ref.current;
      const {renderer, stage} = pixiApp;
      wait(500).then(() => {
        pixiApp.ticker.start();
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
        setTimeout(() => {
          clearContainer(stage);
        }, 500);
        window.removeEventListener('resize', onResize);
      };
    }
  }, [text, fontLoaded]);
  return <div className="hi" ref={ref} />;
};

export default Hi;
