import webfont from 'webfontloader';
import {FONT, FONT_STYLE, MAX_PARTICLES, PARTICLE_SIZE} from './constants';
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
    custom: {
      families: ['Avenir Heavy'],
    },
    active: onSuccess,
  });

const checkColor = (x, y, pixels, textureWidth) => {
  for (let i = 0; i < PARTICLE_SIZE; i++) {
    const index = (y + i) * textureWidth + x + i;
    if (pixels[index][0] > 0) return true;
  }
};
export const createParticles = ({pixels, texture}) => {
  const container = new ParticleContainer(MAX_PARTICLES);
  for (let x = 0; x < Math.floor(texture.width / PARTICLE_SIZE); x++) {
    for (let y = 0; y < Math.floor(texture.height / PARTICLE_SIZE); y++) {
      if (
        checkColor(x * PARTICLE_SIZE, y * PARTICLE_SIZE, pixels, texture.width)
      ) {
        const particle = new Particle(
          x * PARTICLE_SIZE,
          y * PARTICLE_SIZE,
          texture,
        );
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
