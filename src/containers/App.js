require('normalize.css/normalize.css');
require('../styles/index.less');

import React, {useEffect} from 'react';
import Router from './Router';
import {connect} from 'react-redux';
import {initSlides} from '@/store/slice/portfolio';
import {loader} from '@/loader';
import list from '@/projects';

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