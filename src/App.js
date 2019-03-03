require('normalize.css/normalize.css');
require('./styles/index.less');
import React, { PureComponent } from 'react';
import Router from './components/Router';
import { connect } from 'react-redux';
import { initSlides } from './actions/creators';
import { loader } from './loader';
import list from './projects';

class App extends PureComponent {
  componentDidMount() {
    __ee__.on('assets_load', () => {
      const { resources } = loader;
      // collect only our textures, skip displacement map and other stuff
      const textures = list.reduce((acc, { asset_key }) => 
        [ ...acc, resources[asset_key].texture ], []);
      this.props.initSlides(textures);
    });
  }
  render() {
    return (
      <div className="container">
        <Router/>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  initSlides: slides => dispatch(initSlides(slides)),
});
export default connect(null, mapDispatchToProps)(App);
