require('../styles/index.less');

import React, {useEffect} from 'react';
import Router from './Router';
import {connect} from 'react-redux';
import {initSlides} from '@/store/slice/portfolio';
import {loader} from '@/pixi/loader';
import list from '@/projects';
import theme from '@/pixi/theme';

const App = props => {
  useEffect(() => {
    __ee__.on('assets_load', () => {
      const {resources} = loader;
      // collect only our textures, skip displacement map and other stuff
      const textures = list.reduce(
        (acc, {asset_key}) => [...acc, resources[asset_key].texture],
        [],
      );
      window.portfolioTextures = textures;
      theme.bootstrap();
      theme.listenResize();
      props.initSlides();
    });
  }, []);
  return (
    <div className="container">
      <Router />
    </div>
  );
};

const mapDispatch = dispatch => ({
  initSlides: slides => dispatch(initSlides(slides)),
});
export default connect(
  null,
  mapDispatch,
)(App);
