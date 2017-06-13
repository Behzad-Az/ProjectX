import React, {Component} from 'react';
import PreviewRow from './PreviewRow.jsx';

class SubmitModal extends Component {
  constructor(props) {
    super(props);
    this._determineWorkEnviro = this._determineWorkEnviro.bind(this);
    this._divideTweet = this._divideTweet.bind(this);
    this._determineCompanyIdentifier = this._determineCompanyIdentifier.bind(this);
    this._determineTwtArr = this._determineTwtArr.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _determineWorkEnviro() {
    switch(this.props.workEnviro) {
      case 'funny':
        return '#funny';
      case 'sucks':
        return '#sucks';
      default:
        return '';
    }
  }

  _divideTweet(content, sliceLength, tweetBodyArr = []) {
    let tweetBody = content.slice(0, sliceLength);
    if (content.length < sliceLength) {
      tweetBodyArr.push(tweetBody);
      return tweetBodyArr;
    } else {
      let lastSpaceIndex = tweetBody.lastIndexOf(' ');
      tweetBody = tweetBody.slice(0, lastSpaceIndex);
      tweetBodyArr.push(tweetBody + '_');
      return this._divideTweet(content.replace(tweetBody + ' ', ''), sliceLength, tweetBodyArr);
    }
  }

  _determineCompanyIdentifier() {
    if (this.props.workLocationHashtag && this.props.workEnviro) {
      return `${this.props.companyHashtag} ${this.props.workLocationHashtag} ${this._determineWorkEnviro()}`.trim();
    } else if (this.props.workLocationHashtag) {
      return `${this.props.companyHashtag} ${this.props.workLocationHashtag}`.trim()
    } else if (this.props.workEnviro) {
      return `${this.props.companyHashtag} ${this._determineWorkEnviro()}`.trim();
    } else {
      return this.props.companyHashtag.trim();
    }
  }

  _determineTwtArr() {
    const companyIdentifier = this._determineCompanyIdentifier();
    const tweetEnd = '\n#WorkerVent';
    const sliceLength = 140 - companyIdentifier.length - tweetEnd.length - 5;
    return this._divideTweet(this.props.content, sliceLength).map((tweetBody, index, arr) =>
      (arr.length > 1 ? `${index + 1}/${arr.length} ` : '') +
      companyIdentifier + '\n' +
      tweetBody +
      tweetEnd
    );
  }

  _handleSubmit() {
    const data = {
      posterName: this.props.posterName,
      companyHashtag: this.props.companyHashtag,
      workLocationHashtag: this.props.workLocationHashtag,
      workEnviro: this.props.workEnviro,
      content: this.props.content
    };

    this.setState({ showSubmitModal: true });
    fetch('/api/tweets', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(resJSON => {
      if (resJSON) {
        this.props.clearForm();
        this.props.toggleModal();
        this.props.reload();
      } else {
        throw 'Server returned false';
      }
    })
    .catch(err => console.error('Unable to post tweet - ', err));
  }

  render() {
    return (
      <div className={this.props.showModal ? 'modal is-active' : 'modal'}>
        <div className='modal-background' onClick={this.props.toggleModal}></div>
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>Tweet Preview</p>
            <button className='delete' onClick={this.props.toggleModal}></button>
          </header>
          <section className='modal-card-body'>
            { this._determineTwtArr().reverse().map((tweet, index) => <PreviewRow key={index} tweet={tweet} /> ) }

          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' onClick={this._handleSubmit}>Submit Tweet</button>
          </footer>
        </div>
      </div>
    );
  }
}

export default SubmitModal;
