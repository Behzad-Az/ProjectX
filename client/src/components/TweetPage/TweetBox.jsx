import React, {Component} from 'react';

class TweetBox extends Component {
  constructor(props) {
    super(props);
    this.tweet = {
      posterName: 'Anonymous',
      plantName: 'Albian',
      country: 'Canada',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean efficitur sit amet massa fringilla egestas. Nullam condimentum luctus turpis.'
    };
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
                <strong>{this.tweet.plantName} | {this.tweet.country}</strong>
                <small> @{this.tweet.posterName}</small> - <small>31m ago</small>
                <br />
                {this.tweet.content}
              </p>
            </div>
            <nav className='level is-mobile'>
              <div className='level-left'>
                <a className='level-item'>
                  <span className='icon is-small'><i className='fa fa-reply'></i></span>
                </a>
                <a className='level-item'>
                  <span className='icon is-small'><i className='fa fa-retweet'></i></span>
                </a>
                <a className='level-item'>
                  <span className='icon is-small'><i className='fa fa-heart'></i></span>
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
