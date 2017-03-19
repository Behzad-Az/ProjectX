import React, {Component} from 'react';

class WelcomeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // agreementModalClass: 'modal is-active'
      agreementModalClass: 'modal'
    };
  }

  render() {
    return (
      <div className={this.state.agreementModalClass}>
        <div className='modal-background'></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>Welcome to WorkerVent.com!</p>
          </header>
          <section className='modal-card-body'>
            <p className='title is-5'>Remeber to vent responsibly:</p>
            <p className='title is-6'>- Have you seen something crazy, upsetting, or just hilarious at your workplace? Share it here.</p>
            <p className='title is-6'>- Your thoughts will be shared here as well as anonymously on <a href='https://twitter.com/shell_sucks' target='_blank'>Twitter</a></p>
            <p className='title is-6'>- Keep the comments civilized and post carefully (i.e. nothing confidential, disrespectful or personal) - don't get yourself into trouble with your boss. Flagged tweets will be removed.</p>
          </section>
          <footer className='modal-card-foot'>
            <a className='button is-success' onClick={() => this.setState({ agreementModalClass: 'modal' })}>Agree</a>
          </footer>
        </div>
      </div>
    );
  }
}

export default WelcomeModal;
