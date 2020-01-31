import React from 'react';
import {Route, BrowserRouter, Switch} from 'react-router-dom';

import TopMenu from '@/components/Menu';
import AboutPage from '@/pages/About/index';
import MessagePage from '@/pages/Message/index';
import WorksPage from '@/pages/Works/index';
import RouteTransitions from '@/components/RouteTransitions';
import Cursor from '@/components/Cursor';
import RouteWatcher from '@/components/RouteWatcher';

const Router = () => {
  return (
    <BrowserRouter>
      <div className="container--inner">
        <Cursor />
        <TopMenu />
        <RouteWatcher/>
        <Route
          render={({location}) => (
            <RouteTransitions
              routeKey={location.key}
              pathname={location.pathname}>
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
