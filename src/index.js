import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import PublicRoutes, { paths as PUBLIC_PATHS } from './components/PublicRoutes'
import Application from './routes/application';

/*
  STRIPES-NEW-APP
  This is the main entry point into your new app.
*/

class Sso extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
//    stripes: PropTypes.shape({
//      connect: PropTypes.func
//    })
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      match: {
        path
      }
    } = this.props;

    return (
      <Switch>
        <Route
          path={path}
          exact
          component={Application}
        />
      </Switch>
    );
  }
}

Sso.eventListener = (event, _s, _data) => {
  if (event === 'ADD_PUBLIC_ROUTE') {
    
    // Return properties for the route object.
    return {
      path: Object.values(PUBLIC_PATHS),
      render: () => <PublicRoutes />
    };
  }

  return null;
};


export default Sso;
