import React, {Component} from 'react';

class TweetBox extends Component {
  constructor(props) {
    super(props);
    this._findTimePast = this._findTimePast.bind(this);
  }

  _findTimePast(hoursAgo) {
    if (hoursAgo < 1) { return 'Less than 1 hour ago'; }
    else if (hoursAgo < 24) { return `${hoursAgo} hour(s) ago`; }
    else if (hoursAgo < 31 * 24) { return `${Math.floor(hoursAgo/24)} day(s) ago`; }
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
                <a className='level-item'>
                  <span className='icon is-small'><i className='fa fa-reply' /></span>
                </a>
                <a className='level-item'>
                  <span className='icon is-small'><i className='fa fa-retweet' /></span>
                </a>
                <a className='level-item'>
                  <span className='icon is-small'><i className='fa fa-heart' /></span>
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
