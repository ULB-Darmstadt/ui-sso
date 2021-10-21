import React from 'react';
import PropTypes from 'prop-types';
import { Pane, Paneset } from '@folio/stripes/components';

export default class Application extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  render() {
    return (
      <Paneset>
        <Pane defaultWidth="fill" fluidContentWidth paneTitle="ui-sso">
          <p>The main body for the app</p>
        </Pane>
      </Paneset>
    );
  }
}
