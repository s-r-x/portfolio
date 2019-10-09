// https://www.youtube.com/watch?v=k7CnKHRp4mY
// thank you Yuri :)

import {Sprite, Texture, Rectangle} from 'pixi.js';
import {PARTICLE_SIZE} from './constants';

export default class Particle extends Sprite {
  constructor(x, y, texture) {
    super(new Texture(texture));
    this.x = x;
    this.y = y;
    this.texture.frame = new Rectangle(x, y, PARTICLE_SIZE, PARTICLE_SIZE);
    this._initX = x;
    this._initY = y;
    this._speedX = 0;
    this._speedY = 0;
    this._friction = 0.89;
    this._radius = 90;
    this._gravity = 0.01;
    this._maxGravity = 0.03 + Math.random() * 0.03;
  }
  __update(mouseX, mouseY) {
    const a = mouseX - this.x,
      b = mouseY - this.y;
    const dist = Math.sqrt(a * a + b * b);
    const normalX = a / dist;
    const normalY = b / dist;
    if (dist < this._radius) {
      this._gravity *= this._friction;
      this._speedX -= normalX;
      this._speedY -= normalY;
    } else {
      this._gravity += 0.1 * (this._maxGravity - this._gravity);
    }
    const oDistX = this._initX - this.x;
    const oDistY = this._initY - this.y;
    this._speedX += oDistX * this._gravity;
    this._speedY += oDistY * this._gravity;

    this._speedX *= this._friction;
    this._speedY *= this._friction;
    this.x += this._speedX;
    this.y += this._speedY;
  }
}
