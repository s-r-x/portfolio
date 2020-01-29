import React from 'react';
import cn from 'classnames';

const Counter = props => {
  return (
    <div className={cn('works--count', 'theme-dependent', props.isDark && 'is-dark')}>
      <span className="works--count-active">{props.active}</span>
      <span className="works--count-del">-</span>
      <span className="works--count-overall">{props.count}</span>
    </div>
  );
};

export default Counter;
