import {Sprite, Texture, Rectangle} from 'pixi.js';
export default class Particle extends Sprite {
  constructor(x, y, size, texture) {
    super(new Texture(texture));
    this.x = x;
    this.y = y;
    this.texture.frame = new Rectangle(x, y, size, size);
    this.__initialX = x;
    this.__initialY = y;
  }
  __update() {
    this.x += Math.random() - 0.5;
    this.y += Math.random() - 0.5;
  }
}
