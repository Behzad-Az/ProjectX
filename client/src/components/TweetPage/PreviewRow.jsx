import React, {Component} from 'react';

class PreviewRow extends Component {

  render() {
    return (
      <article className='media preview-row'>
        <figure className='media-left'>
          <p className='image is-64x64'>
            <img src='../../images/logo.png' alt='Image' />
          </p>
        </figure>
        <div className='media-content'>
          <div className='content'>
            <strong>WorkerVent</strong>
            <small> @WorkerVent</small>
            <br />
            {this.props.tweet}
          </div>
        </div>
      </article>
    );
  }
}

export default PreviewRow;
