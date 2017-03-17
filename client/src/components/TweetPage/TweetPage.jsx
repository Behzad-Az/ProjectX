import React, {Component} from 'react';
import NewTweetForm from './NewTweetForm.jsx';
import TweetBox from './TweetBox.jsx';

class TweetPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='tweet-page'>
        <NewTweetForm />
        <hr />
        <TweetBox />
      </div>
    );
  }
}

export default TweetPage;
