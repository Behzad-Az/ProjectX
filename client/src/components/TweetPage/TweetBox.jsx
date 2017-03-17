import React, {Component} from 'react';

class TweetBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likeDisabled: false
    };
    this._findTimePast = this._findTimePast.bind(this);
    this._handleSubmitLike = this._handleSubmitLike.bind(this);
  }

  _findTimePast(hoursAgo) {
    if (hoursAgo < 1) { return 'Less than 1 hour ago'; }
    else if (hoursAgo < 24) { return `${hoursAgo} hour(s) ago`; }
    else if (hoursAgo < 31 * 24) { return `${Math.floor(hoursAgo/24)} day(s) ago`; }
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
        if (resJSON) { this.setState({ likeDisabled: true }); }
        else { throw 'Server returned false'; }
      })
      .catch(err => console.error('Unable to post like - ', err));
    }
  }

  render() {
    return (
      <div className='box'>
        <article className='media'>
          <div className='media-left'>
            <figure className='image is-64x64'>
              <img src='http://bulma.io/images/placeholders/128x128.png' alt='Image' />
            </figure>
          </div>
          <div className='media-content'>
            <div className='content'>
              <p>
                <strong>{this.props.tweet.plant_name} | {this.props.tweet.country}</strong>
                <small> @{this.props.tweet.poster_name}</small> - <small>{this._findTimePast(Math.floor(this.props.tweet.hours_ago))}</small>
                <br />
                {this.props.tweet.content}
              </p>
            </div>
            <nav className='level is-mobile'>
              <div className='level-left'>
                <a className='level-item' onClick={this._handleSubmitLike} style={{color: this.state.likeDisabled ? 'red' : ''}}>
                  <span className='icon is-small'><i className='fa fa-heart' /></span>
                </a>
                <small>{this.props.tweet.like_count}</small>
              </div>
            </nav>
          </div>
        </article>
      </div>
    );
  }
}

export default TweetBox;
