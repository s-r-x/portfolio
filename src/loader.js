import { Loader } from 'pixi.js';
import { normalizeThumbPath } from './utils';
import projects from './projects';
export const loader = Loader.shared;

export default function loadAssets(onload) {
  loader.add('disp', '/disp.jpg');
  loader.add('empty', '/empty.png');
  loader.add('bg_dark', '/bg_dark.png');
  loader.add('bg_light', '/light_bg.png');
  projects.forEach(({ thumb, asset_key }) => {
    loader.add(asset_key, normalizeThumbPath(thumb));
  });
  loader.load(onload);
  loader.onError.add(e => console.error(e));
}
