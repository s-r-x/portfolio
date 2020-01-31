import React from 'react';
import Hoverable from '@/components/Hoverable';

const LangToggler = props => {
  return (
    <div className="lang-toggler theme-dependent">
      <Hoverable style={{display: 'inline-block'}}>
        <button
          className={props.lang === 'en' ? 'is-active' : ''}
          aria-label="Change language to english"
          onClick={() => props.changeLang('en')}>
          en{' '}
        </button>
      </Hoverable>
      <span className="delimiter">/</span>
      <Hoverable style={{display: 'inline-block'}}>
        <button
          className={props.lang === 'ru' ? 'is-active' : ''}
          aria-label="Изменить язык на русский"
          onClick={() => props.changeLang('ru')}>
          {' '}
          ru
        </button>
      </Hoverable>
    </div>
  );
};
export default LangToggler;
