import * as PIXI from 'pixi.js';
import {THUMBS_BASE_URL, RETINA_PREFIX} from './constants';

export const clearContainer = container => {
  while (container.children.length !== 0) {
    container.removeChild(container.children[0]);
  }
};

export function normalizeThumbPath(url) {
  if (window.devicePixelRatio <= 1) {
    return THUMBS_BASE_URL + url;
  }
  const [base, ext] = url.split('.');
  return THUMBS_BASE_URL + base + RETINA_PREFIX + '.' + ext;
}
export const wait = ms => new Promise(r => setTimeout(r, ms));
