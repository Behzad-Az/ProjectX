import React, {Component} from 'react';
import NewTweetForm from './NewTweetForm.jsx';
import TweetBox from './TweetBox.jsx';

class TweetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      tweets: []
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._renderPageAfterData = this._renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData();
  }

  _conditionData(resJSON) {
    if (resJSON) {
      resJSON.dataLoaded = true;
      this.setState(resJSON);
    } else {
      throw 'Server returned false.';
    }
  }

  _loadComponentData() {
    fetch('/api/home', {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _renderPageAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <div className='main-container'>
          <p className='page-msg'>
            <i className='fa fa-exclamation-triangle' aria-hidden='true' />
            Error in loading up the page
          </p>
        </div>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className='main-container'>
          <p className='title is-6'>Do you think Shell sucks? Share your thoughts here.</p>
          <p className='title is-6'>Your thoughts will be shared here as well as anonymously on Twitter.</p>
          <p className='title is-6'>Keep the comments civilized and post carefully (i.e. don't get yourself into trouble with your boss).</p>
          <NewTweetForm reload={this._loadComponentData} />
          <hr />
          { this.state.tweets.map(tweet => <TweetBox key={tweet.id} tweet={tweet} />) }
        </div>
      );
    } else {
      return (
        <div className='main-container'>
          <p className='page-msg'>
            <i className='fa fa-spinner fa-spin fa-3x fa-fw' />
            <span className='sr-only'>Loading...</span>
          </p>
        </div>
      );
    }
  }

  render() {
    return (
      <div className='tweet-page'>
        { this._renderPageAfterData() }
      </div>
    );
  }
}

export default TweetPage;
