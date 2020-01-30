export const THUMBS_BASE_URL = '/thumbs';
export const THUMB_RATIO = 700 / 350;
export const RESIZE_DELAY = 250;
export const MAIL_URL = 'https://s-r-x.com/mailer';
export const RETINA_PREFIX = '@2x';

export const CURSOR_RADIUS = 16;

export const ACCENT_COLOR = 0xe91e63;

const { matches: hoverSupport } = window.matchMedia("(hover: hover)");
export const IS_MOBILE = !hoverSupport;
