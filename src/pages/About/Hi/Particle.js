import {Sprite, Texture, Rectangle} from 'pixi.js';
export default class Particle extends Sprite {
  constructor(x, y, texture) {
    super(new Texture(texture));
    this.x = x;
    this.y = y;
    this.texture.frame = new Rectangle(x, y, 1, 1);
    this._initX = x;
    this._initY = y;
    this._speedX = 0;
    this._speedY = 0;
    this._friction = 0.8;
    this._radius = 150;
    this._gravity = 0.1;
  }
  __update(mouseX, mouseY) {
    const a = mouseX - this._initX, b = mouseY - this._initY;
    const dist = Math.hypot(a, b);
    if (dist < this._radius) {
      this._speedX -= a / dist;
      this._speedY -= b / dist;
    }
    this._speedX += (this._initX - this.x) * this._gravity;
    this._speedY += (this._initY - this.y) * this._gravity;
    this._speedX *= this._friction;
    this._speedY *= this._friction;
    this.x += this._speedX;
    this.y += this._speedY;
  }
}
