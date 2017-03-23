import React, {Component} from 'react';

class TweetBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likeDisabled: false,
      flagDisabled: false,
      likeCount: this.props.tweet.like_count
    };
    this._findTimePast = this._findTimePast.bind(this);
    this._findBoxHeader = this._findBoxHeader.bind(this);
    this._handleSubmitLike = this._handleSubmitLike.bind(this);
    this._handleSubmitFlag = this._handleSubmitFlag.bind(this);
  }

  _findTimePast(hoursAgo) {
    if (hoursAgo < 1) { return 'Less than 1 hour ago'; }
    else if (hoursAgo < 24) { return `${hoursAgo} hour(s) ago`; }
    else if (hoursAgo < 31 * 24) { return `${Math.floor(hoursAgo/24)} day(s) ago`; }
  }

  _findBoxHeader() {
    return `${this.props.tweet.company}` + (this.props.tweet.location ? ` | ${this.props.tweet.location}` : '');
  }

  _handleSubmitLike() {
    if (!this.state.likeDisabled) {
      fetch(`/api/tweets/${this.props.tweet.id}/likes`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ like: 1 })
      })
      .then(response => response.json())
      .then(resJSON => {
        if (resJSON) { this.setState({ likeDisabled: true, likeCount: this.state.likeCount + 1 }); }
        else { throw 'Server returned false'; }
      })
      .catch(err => console.error('Unable to post like - ', err));
    }
  }

  _handleSubmitFlag() {
    if (!this.state.flagDisabled) {
      fetch(`/api/tweets/${this.props.tweet.id}/flags`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ flag: 1 })
      })
      .then(response => response.json())
      .then(resJSON => {
        if (resJSON) { this.setState({ flagDisabled: true }); }
        else { throw 'Server returned false'; }
      })
      .catch(err => console.error('Unable to post like - ', err));
    }
  }

  render() {
    return (
      <div className='tweet box'>
        <article className='media'>
          <div className='media-left'>
            <figure className='image is-64x64'>
              <img src='http://bulma.io/images/placeholders/128x128.png' alt='Image' />
            </figure>
          </div>
          <div className='media-content'>
            <div className='content'>
              <p>
                <strong>{this._findBoxHeader()}</strong>
                <small> by {this.props.tweet.poster_name}</small> - <small>{this._findTimePast(Math.floor(this.props.tweet.hours_ago))}</small>
                <br />
                {this.props.tweet.content}
              </p>
            </div>
            <nav className='level is-mobile'>
              <div className='level-left'>
                <small>{this.state.likeCount}</small>
                <a className='level-item' onClick={this._handleSubmitLike} style={{color: this.state.likeDisabled ? 'rgb(210, 50, 30)' : ''}}>
                  <span className='icon is-small'><i className='fa fa-heart' /></span>
                </a>
                <a className='level-item' onClick={this._handleSubmitFlag} style={{color: this.state.flagDisabled ? 'rgb(210, 50, 30)' : ''}}>
                  <span className='icon is-small'><i className='fa fa-flag' /></span>
                </a>
              </div>
            </nav>
          </div>
        </article>
      </div>
    );
  }
}

export default TweetBox;
