import React from 'react';
import cn from 'classnames';

const Hamburger = ({open, close, isOpen}) => (
  <button
    className={cn('hamburger', isOpen && 'is-active', 'theme-dependent')}
    onClick={isOpen ? close : open}>
    <span className="hamburger--top"></span>
    <span className="hamburger--middle"></span>
    <span className="hamburger--bottom"></span>
  </button>
);

export default Hamburger;
