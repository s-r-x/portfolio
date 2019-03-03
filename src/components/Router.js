import React from 'react';
import { Route, Router, Redirect } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import { AnimatedSwitch } from 'react-router-transition';


import TopMenu from './Menu';
import Hamburger from './Hamburger';
import AboutPage from '../pages/About/index';
import MessagePage from '../pages/Message/index';
import WorksPage from '../pages/Works/index';


const customHistory = createBrowserHistory()

// react-router-transition throw some weird error on redirects
// still works btw
const _Router = () => { 
  return (
    <Router history={customHistory}>
      <div className="container--inner">
        <TopMenu history={customHistory}/>
        <Hamburger/>
        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
          className="switch-wrapper"
        >
          <Route exact path="/" render={() => <Redirect to="/works"/>}/>
          <Route path="/about" component={AboutPage}/>
          <Route path="/works" component={WorksPage}/>
          <Route path="/message" component={MessagePage}/>
        </AnimatedSwitch>
      </div>
    </Router>
  )
};

export default _Router;
