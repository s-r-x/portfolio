import React from 'react';
import './index.less';
import {connect} from 'react-redux';
import dict from '@/translations';
import Hi from './Hi';
import cn from 'classnames';

const AboutPage = ({lang, theme}) => {
  const isDark = theme === 'light';
  return (
    <section className="about">
      <Hi text={dict.about_hello[lang]} />
      <div className="about--inner">
        <div
          className={cn('about--left', 'theme-dependent', isDark && 'is-dark')}>
          <h2>{dict.about_hello[lang]}</h2>
        </div>
        <div className="about--right">
          <div className="about--border" />
          <div className="about--content-overflow">
            <div className="about--content">
              <p className={cn('theme-dependent', isDark && 'is-dark')}>
                {dict.about_first_p[lang]}
              </p>
              <p className={cn('theme-dependent', isDark && 'is-dark')}>
                {dict.about_second_p[lang]}
              </p>
              <div
                className={cn(
                  'about--links',
                  'theme-dependent',
                  isDark && 'is-dark',
                )}>
                <a href="tg://resolve?domain=srx90">Telegram</a>
                <a href="skype:ilyastrus?add">Skype</a>
                <a href="https://github.com/s-r-x" target="_blank">
                  Github
                </a>
                <a href="mailto:strax1990@gmail.com">Email</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapState = ({lang, theme}) => ({
  lang,
  theme,
});
export default connect(mapState)(AboutPage);
