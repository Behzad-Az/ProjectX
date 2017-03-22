import React, {Component} from 'react';

class TweetBox extends Component {
  constructor(props) {
    super(props);
    this.charLenghts = {
      posterName: 15,
      location: 15,
      country: 15,
      title: 20,
      company: 20,
      content: 1500
    };
    this.state = {
      posterName: '',
      company: '',
      location: '',
      country: '',
      content: '',
      title: '',
      anonymous: true
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleClear = this._handleClear.bind(this);
    this._handleAnonymous = this._handleAnonymous.bind(this);
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
      posterName: '',
      company: '',
      location: '',
      country: '',
      content: '',
      title: ''
    });
  }

  _validateForm() {
    // return this.state.posterName.length <= this.charLenghts.posterName &&
    //        this.state.location.length <= this.charLenghts.location &&
    //        this.state.country.length <= this.charLenghts.country &&
    //        this.state.title.length <= this.charLenghts.title &&
    //        this.state.company.length >= 3 &&
    //        this.state.company.length <= this.charLenghts.company &&
    //        this.state.content.length >= 3 &&
    //        this.state.content.length <= this.charLenghts.content;
    return true;
  }

  _handleSubmit() {
    let data = {
      posterName: this.state.posterName,
      company: this.state.company,
      location: this.state.location,
      country: this.state.country,
      title: this.state.title,
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

  _handleAnonymous(e) {
    let anonymous = e.target.checked;
    let posterName = '';
    this.setState({ anonymous, posterName });
  }

  render() {
    return (
      <div className='new-tweet-form'>

        <div className='toprow'>
          <div className='field'>
            <p className='char-counter'>{this.state.company.length > this.charLenghts.company ? 'Too Long' : ''}</p>
            <p className='control'>
              <input className='input' type='text' name='company' placeholder='Company*' value={this.state.company} onChange={this._handleChange} />
            </p>
          </div>
          <div className='field'>
            <p className='char-counter'>{this.state.location.length > this.charLenghts.location ? 'Too Long' : ''}</p>
            <p className='control'>
              <input className='input' type='text' name='location' placeholder='Location (Optional)' value={this.state.location} onChange={this._handleChange} />
            </p>
          </div>
          <div className='field'>
            <p className='char-counter'>{this.state.country.length > this.charLenghts.country ? 'Too Long' : ''}</p>
            <p className='control'>
              <input className='input' type='text' name='country' placeholder='Country (Optional)' value={this.state.country} onChange={this._handleChange} />
            </p>
          </div>
        </div>

        <div className='comment field'>
          <p className='control'>
            <textarea className='textarea' name='content' placeholder='Enter your comment here* (1500 character limit)' value={this.state.content} onChange={this._handleChange} />
          </p>
          <p className='char-counter' style={{color: this.state.content.length <= this.charLenghts.content ? 'inherit' : ''}}>{this.state.content.length}</p>
        </div>

        <div className='bottomrow'>
          <div className='field'>
            <p className='char-counter'>{this.state.title.length > this.charLenghts.title ? 'Too Long' : ''}</p>
            <p className='control'>
              <input className='input' type='text' name='title' placeholder='Title (Optional)' value={this.state.title} onChange={this._handleChange} />
            </p>
          </div>
          <div className='field'>
            <p className='control'>
              <label className='checkbox'>
                <input type='checkbox' defaultChecked={true} onChange={this._handleAnonymous} />
                Anonymous
              </label>
            </p>
          </div>
          { !this.state.anonymous &&
            <div className='field'>
              <p className='char-counter'> {this.state.posterName.length > this.charLenghts.posterName ? 'Too Long' : ''}</p>
              <p className='control'>
                <input className='input is-inline' type='text' name='posterName' placeholder='Your Name' value={this.state.posterName} onChange={this._handleChange} />
              </p>
            </div>
          }
        </div>

        <div className='field is-grouped'>
          <p className='control'>
            <button className='button is-primary' onClick={this._handleSubmit} disabled={!this._validateForm()}>Submit</button>
          </p>
          <p className='control'>
            <button className='button is-link' onClick={this._handleClear}>Clear</button>
          </p>
          <p className='control'>
            <button className='button is-link' onClick={this.props.showRules}>Rules of Posting</button>
          </p>
        </div>

      </div>
    );
  }
}

export default TweetBox;
