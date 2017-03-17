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
    this._validateForm = this._validateForm.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  _handleClear() {
    this.setState({
      posterName: 'Anonymous',
      plantName: '',
      country: '',
      content: ''
    });
  }

  _validateForm() {
    return this.state.posterName.length <= 20 &&
           this.state.plantName.length <= 20 &&
           this.state.country.length <= 20 &&
           this.state.content.length >= 3 &&
           this.state.content.length <= 1500;
  }

  _handleSubmit() {
    let data = {
      posterName: this.state.posterName,
      plantName: this.state.plantName,
      country: this.state.country,
      content: this.state.content
    };

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
        this._handleClear();
        this.props.reload();
      } else {
        throw 'Server returned false';
      }
    })
    .catch(err => console.error('Unable to post tweet - ', err));
  }

  render() {
    return (
      <div className='new-tweet-form'>

        <label className='label'>New Comment:</label>

        <div className='toprow'>
          <div className='field'>
            <p className='control'>
              <input className='input' type='text' name='posterName' placeholder='Your Name (Optional)' value={this.state.posterName} onChange={this._handleChange} />
            </p>
            <p className='char-counter' style={{color: this.state.posterName.length > 20 ? 'red' : 'inherit'}}>{this.state.posterName.length}</p>
          </div>

          <div className='field'>
            <p className='control'>
              <input className='input' type='text' name='plantName' placeholder='Plant (Optional)' value={this.state.plantName} onChange={this._handleChange} />
            </p>
            <p className='char-counter' style={{color: this.state.plantName.length > 20 ? 'red' : 'inherit'}}>{this.state.plantName.length}</p>
          </div>

          <div className='field'>
            <p className='control'>
              <input className='input' type='text' name='country' placeholder='Country (Optional)' value={this.state.country} onChange={this._handleChange} />
            </p>
            <p className='char-counter' style={{color: this.state.country.length > 20 ? 'red' : 'inherit'}}>{this.state.country.length}</p>
          </div>
        </div>

        <div className='field'>
          <p className='control'>
            <textarea className='textarea' name='content' placeholder='Enter your comment here...' value={this.state.content} onChange={this._handleChange} />
          </p>
          <p className='char-counter' style={{color: this.state.content.length > 1500 ? 'red' : 'inherit'}}>{this.state.content.length}</p>
        </div>

        <div className='field is-grouped'>
          <p className='control'>
            <button className='button is-primary' onClick={this._handleSubmit} disabled={!this._validateForm()}>Submit</button>
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
