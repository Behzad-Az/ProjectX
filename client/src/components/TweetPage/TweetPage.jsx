import React, {Component} from 'react';
import NewTweetForm from './NewTweetForm.jsx';
import TweetBox from './TweetBox.jsx';
import WelcomeModal from './WelcomeModal.jsx';
import Navbar from '../Navbar/Navbar.jsx';

class TweetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      pageError: false,
      showWelcomeModal: false,
      tweets: []
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._toggleWelcomeModal = this._toggleWelcomeModal.bind(this);
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

  _toggleWelcomeModal() {
    this.setState({ showWelcomeModal: !this.state.showWelcomeModal });
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
          <WelcomeModal showModal={this.state.showWelcomeModal} toggleModal={this._toggleWelcomeModal} />
          <p className='header'>Start Venting:</p>
          <NewTweetForm reload={this._loadComponentData} showRules={this._toggleWelcomeModal} />
          <p className='header'>Previous Vents:</p>
          { this.state.tweets.map(tweet => <TweetBox key={tweet.id} tweet={tweet} />) }
          { !this.state.tweets[0] && <p className='title is-6'>Nothing posted yet :(</p> }
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
        <Navbar />
        { this._renderPageAfterData() }
      </div>
    );
  }
}

export default TweetPage;
