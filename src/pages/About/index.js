import React from 'react';
import './index.less';
import {connect} from 'react-redux';
import dict from '../../translations';
import Hi from './Hi';

const AboutPage = ({lang}) => {
  return (
    <section className="about">
      <Hi text={dict.about_hello[lang]} />
      <div className="about--inner">
        <div className="about--right">
          <p>{dict.about_first_p[lang]}</p>
          <p>{dict.about_second_p[lang]}</p>
          <div className="about--links">
            <a href="tg://resolve?domain=srx90">Telegram</a>
            <a href="skype:ilyastrus?add">Skype</a>
            <a href="https://github.com/s-r-x" target="_blank">
              Github
            </a>
            <a href="mailto:strax1990@gmail.com">Email</a>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = ({lang}) => ({
  lang,
});
export default connect(mapStateToProps)(AboutPage);
