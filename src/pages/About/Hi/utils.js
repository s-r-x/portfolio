import webfont from 'webfontloader';
import {FONT, FONT_STYLE, MAX_PARTICLES} from './constants';
import Particle from './Particle';
import {
  ParticleContainer,
  Container,
  RenderTexture,
  Text,
  TextStyle,
} from 'pixi.js';

export const loadFont = onSuccess =>
  webfont.load({
    google: {
      families: [FONT],
    },
    active: onSuccess,
  });

export const createParticles = ({pixels, texture}) => {
  const container = new ParticleContainer(MAX_PARTICLES);
  for (let x = 0; x < Math.floor(texture.width); x++) {
    for (let y = 0; y < Math.floor(texture.height); y++) {
      const index = y * texture.width + x;
      if (pixels[index][0] > 0) {
        const particle = new Particle(x, y, texture);
        container.addChild(particle);
      }
    }
  }
  return container;
};

export const createTextureFromText = ({text, renderer}) => {
  const textStyle = new TextStyle(FONT_STYLE);
  const textContainer = new Container();
  textContainer.addChild(new Text(text, textStyle));
  const rt = RenderTexture.create(textContainer.width, textContainer.height);
  renderer.render(textContainer, rt);
  textContainer.destroy();
  return rt;
};

export const mapNumber = (x, a, b, c, d,) => (x - a) * ( (d - c) / (b - a) ) + c;
