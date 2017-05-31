import React, {Component} from 'react';
import Navbar from '../Navbar/Navbar.jsx';
import WelcomeModal from './WelcomeModal.jsx';
import NewTweetForm from './NewTweetForm.jsx';
import TweetsContainer from './TweetsContainer.jsx';

class TweetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showWelcomeModal: true,
      tweetsState: 0
    };
    this._toggleWelcomeModal = this._toggleWelcomeModal.bind(this);
  }

  _toggleWelcomeModal() {
    this.setState({ showWelcomeModal: !this.state.showWelcomeModal });
  }

  render() {
    return (
      <div className='tweet-page'>
        <Navbar />
        <div className='main-container'>
          <WelcomeModal
            showModal={this.state.showWelcomeModal}
            toggleModal={this._toggleWelcomeModal} />
          <NewTweetForm
            reload={() => this.setState({ tweetsState: this.state.tweetsState + 1 })}
            showRules={this._toggleWelcomeModal} />
          <TweetsContainer parentState={this.state.tweetsState} />
        </div>

      </div>
    );
  }
}

export default TweetPage;
