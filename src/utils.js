import * as PIXI from 'pixi.js';
import { THUMBS_BASE_URL, RETINA_PREFIX } from './constants';
//
// https://gist.github.com/ClickSimply/581823db9cdc8d94ed3f78c1a548f50d
export function scaleSprite(inputSprite, targetWidth, targetHeight) {
  var sprite = inputSprite;
  var bgContainer = new PIXI.Container();
  var mask = new PIXI.Graphics().beginFill(0x8bc5ff).drawRect(0,0, targetWidth, targetHeight).endFill();
  bgContainer.mask = mask;
  bgContainer.addChild(mask);
  bgContainer.addChild(sprite);
  const bgSize = { x: targetWidth, y: targetHeight };
  var sp = {x:sprite.width,y:sprite.height};
  var winratio = bgSize.x/bgSize.y;
  var spratio = sp.x/sp.y;
  var scale = 1;
  var pos = new PIXI.Point(0,0);
  if(winratio > spratio) {
    //photo is wider than background
    scale = bgSize.x/sp.x;
    pos.y = -((sp.y*scale)-bgSize.y)/2
  } else {
    //photo is taller than background
    scale = bgSize.y/sp.y;
    pos.x = -((sp.x*scale)-bgSize.x)/2
  }

  sprite.scale = new PIXI.Point(scale,scale);
  sprite.position = pos;
  return bgContainer;
}

export const mapNumber = (x, a, b, c, d,) => (x - a) * ( (d - c) / (b - a) ) + c;

export const isMobile = window.hasOwnProperty('orientation');

export const clearContainer = container => {
  while(container.children.length !== 0) {
    container.removeChild(container.children[0]);
  }
}

export function normalizeThumbPath(url) {
  if(window.devicePixelRatio <= 1) {
    return THUMBS_BASE_URL + url;
  }
  const [ base, ext ] = url.split('.');
  return THUMBS_BASE_URL + base + RETINA_PREFIX + '.' + ext;
}
