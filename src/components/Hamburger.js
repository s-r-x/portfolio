import React from 'react';
import TweenLite from 'gsap/TweenLite';

const clickHandler = (e) => {
  const $menu = document.querySelector('.top-menu');
  const $ham = document.querySelector('.hamburger');
  if($ham.classList.contains('is-active')) {
    $menu.classList.remove('is-active');
    $ham.classList.remove('is-active');
  }
  else {
    $menu.classList.add('is-active');
    $ham.classList.add('is-active');
  }
};
const Hamburger = () => (
  <button className="hamburger" onClick={clickHandler}>
    <span className="hamburger--top"></span>
    <span className="hamburger--middle"></span>
    <span className="hamburger--bottom"></span>
  </button>
);

export default Hamburger;
