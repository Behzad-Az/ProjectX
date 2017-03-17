import React from 'react';
import {Router, Route, browserHistory} from 'react-router';
import TweetPage from './TweetPage/TweetPage.jsx';

class AppComponent extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path={'*'} component={TweetPage} />
      </Router>
    );
  }
}

export default AppComponent;
