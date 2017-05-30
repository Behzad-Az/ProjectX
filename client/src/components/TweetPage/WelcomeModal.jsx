import React, {Component} from 'react';
import { Link } from 'react-router';

class WelcomeModal extends Component {
  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background'></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>Welcome to WorkerVent.com!</p>
          </header>
          <section className='modal-card-body'>
            <p className='title is-5'>Remember to vent responsibly:</p>
            <p className='title is-6'>- Have something good, bad, funny or interesting to share about your job? Share it with the world here.</p>
            <p className='title is-6'>- Your thoughts will be shared here as well as anonymously on <Link href='https://twitter.com/workervent' target='_blank'>Twitter</Link>.</p>
            <p className='title is-6'>- Keep the venting civilized and post carefully. Content deemed to be confidential, disrespectful, or hateful will be removed without notice.</p>
            <p className='title is-6'>- Flagged tweets are continously reviewed and could be removed without notice.</p>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' onClick={this.props.toggleModal}>Agree to Continue</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default WelcomeModal;
