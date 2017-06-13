import React, {Component} from 'react';

class TweetRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      likeClicked: false,
      flagClicked: false,
      likeCount: this.props.tweet.like_count
    };
    this._findBoxHeader = this._findBoxHeader.bind(this);
    this._handleSubmitLike = this._handleSubmitLike.bind(this);
    this._handleSubmitFlag = this._handleSubmitFlag.bind(this);
  }

  _findBoxHeader() {
    return `${this.props.tweet.company_hashtag}` +
           (this.props.tweet.work_location_hashtag ? ` | ${this.props.tweet.work_location_hashtag}` : '') +
           (this.props.tweet.work_enviro ? ` | ${this.props.tweet.work_enviro}` : '');
  }

  _handleSubmitLike() {
    if (!this.state.likeClicked) {
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
        if (resJSON) { this.setState({ likeClicked: true, likeCount: this.state.likeCount + 1 }); }
        else { throw 'Server returned false'; }
      })
      .catch(err => console.error('Unable to post like - ', err));
    }
  }

  _handleSubmitFlag() {
    if (!this.state.flagClicked) {
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
        if (resJSON) { this.setState({ flagClicked: true }); }
        else { throw 'Server returned false'; }
      })
      .catch(err => console.error('Unable to post flag - ', err));
    }
  }

  render() {
    return (
      <article className='media tweet-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src='../../images/logo.png' alt='Image' />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <strong>{this._findBoxHeader()}</strong>
            <small> by {this.props.tweet.poster_name}</small>
            <br />
            {this.props.tweet.content}
            <br />
            <small>
              <span className='footer-item'>{this.props.tweet.created_at.slice(0, 10)}</span>
              <span className='footer-item'>
                <i
                  className='fa fa-heart'
                  aria-hidden='true'
                  onClick={this._handleSubmitLike}
                  style={{ color: this.state.likeClicked ? '#004E89' : '' }}
                />
                ({this.state.likeCount})
              </span>
              <i
                className='fa fa-flag footer-item'
                aria-hidden='true'
                onClick={this._handleSubmitFlag}
                style={{ color: this.state.flagClicked ? '#004E89' : '' }}
              />
            </small>
          </div>
        </div>
      </article>
    );
  }
}

export default TweetRow;
