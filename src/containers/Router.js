import React from 'react';
import {Route, BrowserRouter, Switch} from 'react-router-dom';

import TopMenu from '@/components/Menu';
import Hamburger from '@/components/Hamburger';
import AboutPage from '@/pages/About/index';
import MessagePage from '@/pages/Message/index';
import WorksPage from '@/pages/Works/index';
import RouteTransitions from '@/components/RouteTransitions';
import Cursor from '@/components/Cursor';

const Router = () => {
  return (
    <BrowserRouter>
      <div className="container--inner">
        <Cursor/>
        <TopMenu />
        <Hamburger />
        <Route
          render={({location}) => (
            <RouteTransitions routeKey={location.key} pathname={location.pathname}>
              <Switch location={location}>
                <Route exact path="/" component={WorksPage} />
                <Route path="/about" component={AboutPage} />
                <Route path="/message" component={MessagePage} />
              </Switch>
            </RouteTransitions>
          )}
        />
      </div>
    </BrowserRouter>
  );
};

export default Router;
