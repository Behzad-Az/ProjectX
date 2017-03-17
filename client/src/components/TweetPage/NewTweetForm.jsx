import React, {Component} from 'react';

class TweetBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posterName: 'Anonymous',
      plantName: '',
      country: '',
      content: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleClear = this._handleClear.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  _handleClear() {
    this.setState({
      posterName: '',
      plantName: '',
      country: '',
      content: ''
    });
  }

  _handleSubmit() {
    console.log("i'm here 0: ", this.state);
  }

  render() {
    return (
      <div className='new-tweet-form'>
        <label className='label'>New Comment:</label>

        <div className='toprow'>
          <div className='field'>
            <p className='control'>
              <input className='input' type='text' name='posterName' placeholder='Enter your name (optional and at your own risk)' value={this.state.posterName} onChange={this._handleChange} />
            </p>
          </div>

          <div className='field'>
            <p className='control'>
              <input className='input' type='text' name='plantName' placeholder='Plant Name' value={this.state.plantName} onChange={this._handleChange} />
            </p>
          </div>

          <div className='field'>
            <p className='control'>
              <input className='input' type='text' name='country' placeholder='Country' value={this.state.country} onChange={this._handleChange} />
            </p>
          </div>
        </div>

        <div className='field'>
          <p className='control'>
            <textarea className='textarea' name='content' placeholder='Enter your comment here...' value={this.state.content} onChange={this._handleChange} />
          </p>
        </div>

        <div className='field is-grouped'>
          <p className='control'>
            <button className='button is-primary' onClick={this._handleSubmit}>Submit</button>
          </p>
          <p className='control'>
            <button className='button is-link' onClick={this._handleClear}>Clear</button>
          </p>
        </div>
      </div>
    );
  }
}

export default TweetBox;
