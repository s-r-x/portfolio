import {Container, Loader, Sprite, TilingSprite, Graphics} from 'pixi.js';
import {themeStage} from '.';
import {clearContainer} from '@/utils';
import debounce from 'lodash.debounce';
import {RESIZE_DELAY} from '@/constants';

class Theme {
  constructor(stage) {
    this.lightTxt;
    this.darkTxt;
    this.lightSprite;
    this.darkSprite;
    this.stage = stage;
    this.darkMask;
    this.lightMask;
    this.MASK_RADIUS = 100;
    this.theme = 'dark';
  }
  get activeMask() {
    return this.theme === 'dark' ? this.lightMask : this.darkMask;
  }
  get secondaryMask() {
    return this.theme === 'dark' ? this.darkMask : this.lightMask;
  }
  bootstrap() {
    this.darkTxt = Loader.shared.resources.bg_dark.texture;
    this.lightTxt = Loader.shared.resources.bg_light.texture;
    const lightMask = this._createMask();
    lightMask.scale.set(0, 0);
    this.stage.addChild(lightMask);
    const darkMask = this._createMask();
    darkMask.scale.set(0, 0);
    this.stage.addChild(darkMask);
    this.darkMask = darkMask;
    this.darkSprite = new TilingSprite(
      this.darkTxt,
      document.body.offsetWidth,
      document.body.offsetHeight,
    );
    this.lightSprite = new TilingSprite(
      this.lightTxt,
      document.body.offsetWidth,
      document.body.offsetHeight,
    );
    this.stage.addChild(this.darkSprite);
    this.stage.addChild(this.lightSprite);
    this.lightMask = lightMask;
    this.lightSprite.mask = lightMask;
  }
  listenResize() {
    window.addEventListener('resize', debounce(this._resize, RESIZE_DELAY));
  }
  swapBgs() {
    const activeMask = this.activeMask;
    const anotherMask = this.secondaryMask;
    const {children} = this.stage;
    const len = children.length;
    const hiddenIndex = len - 2;
    const visibleIndex = len - 1;
    const hiddenSprite = children[hiddenIndex];
    const visibleSprite = children[visibleIndex];

    activeMask.scale.set(0, 0);
    visibleSprite.mask = null;

    anotherMask.scale.set(0, 0);
    hiddenSprite.mask = anotherMask;
    this.stage.children.splice(hiddenIndex, 1);
    this.stage.children.push(hiddenSprite);
  }
  _createMask() {
    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawCircle(0, 0, this.MASK_RADIUS);
    mask.endFill();
    return mask;
  }
  _resize = () => {
    clearContainer(this.stage);
    this.bootstrap();
    if (this.theme === 'light') {
      this.swapBgs();
    }
  };
}
export default new Theme(themeStage);
