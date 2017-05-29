import React, {Component} from 'react';
import InvalidCharChecker from '../Partials/InvalidCharChecker.jsx';

class TweetBox extends Component {
  constructor(props) {
    super(props);
    this.formLimits = {
      posterName: { min: 3, max: 15 },
      location: { min: 3, max: 15 },
      company: { min: 3, max: 20 },
      content: { min: 3, max: 500 }
    };
    this.state = {
      posterName: '',
      company: '',
      location: '',
      content: '',
      workEnviro: '',
      showResults: false,
      searchResults: []
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleClear = this._handleClear.bind(this);
    this._validatePosterName = this._validatePosterName.bind(this);
    this._validateLocation = this._validateLocation.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._hanldeCompanySearch = this._hanldeCompanySearch.bind(this);
    this._conditionCompanySearchResults = this._conditionCompanySearchResults.bind(this);
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
      content: '',
      workEnviro: ''
    });
  }

  _validatePosterName() {
    if (this.state.posterName) {
      return this.state.posterName.length >= this.formLimits.posterName.min &&
             !InvalidCharChecker(this.state.posterName, this.formLimits.posterName.max, 'posterName');
    } else {
      return true;
    }
  }

  _validateLocation() {
    if (this.state.location) {
      return this.state.location.length >= this.formLimits.location.min &&
             !InvalidCharChecker(this.state.location.replace(/ /g, '_'), this.formLimits.location.max, 'location');
    } else {
      return true;
    }
  }

  _validateForm() {
    return this._validatePosterName() &&
           this._validateLocation() &&
           this.state.company.length >= this.formLimits.company.min &&
           !InvalidCharChecker(this.state.company.replace(/ /g, '_'), this.formLimits.company.max, 'company') &&
           this.state.content.length >= this.formLimits.content.min &&
           !InvalidCharChecker(this.state.content, this.formLimits.content.max, 'content');
  }

  _hanldeCompanySearch(e) {
    const query = e.target.value;
    this.setState({ company: query });
    if (query.length > 2) {
      fetch('/api/searchbar', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          searchType: 'companyName'
        })
      })
      .then(response => response.json())
      .then(resJSON => {
        if (resJSON) { this._conditionCompanySearchResults(resJSON); }
        else { throw 'Server returned false'; }
      })
      .catch(err => console.error('Unable to process search query - ', err));
    } else {
      this.setState({ searchResults: [], showResults: false });
    }
  }

  _conditionCompanySearchResults(resJSON) {
    if (resJSON.searchResults.length) {
      const searchResults = resJSON.searchResults.map(result =>
        <p key={result._source.id} className='result-row valid' onClick={() => this.setState({ companyName: result._source.company_name, showResults: false, searchResults: [] })}>
          <i className='fa fa-briefcase' /> {result._source.company_name}
        </p>
      );
      this.setState({ searchResults, showResults: true });
    }
  }

  _handleSubmit() {
    const data = {
      posterName: this.state.posterName,
      company: this.state.company,
      location: this.state.location,
      workEnviro: this.state.workEnviro,
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
    console.log("i'm here 0: ", this.state.searchResults);
    return (
      <div className='new-tweet-form'>

        <div className='toprow'>

          <div className='field'>
            { InvalidCharChecker(this.state.company.replace(/ /g, '_'), this.formLimits.company.max, 'company') && <p className='invalid-msg'>Invalid</p> }
            <div className='search-bar-container'>
              <p className='search-bar control'>
                <input
                  className='input'
                  type='text'
                  name='company'
                  placeholder='Company*'
                  value={this.state.companyName}
                  onChange={this._hanldeCompanySearch}
                  style={{ borderColor: InvalidCharChecker(this.state.company.replace(/ /g, '_'), this.formLimits.company.max, 'company') ? '#9D0600' : '' }} />
              </p>
              <div className={this.state.showResults ? 'search-bar results is-enabled' : 'search-bar results'}>
                { this.state.searchResults }
              </div>
            </div>
          </div>

          <div className='field'>
            { InvalidCharChecker(this.state.location.replace(/ /g, '_'), this.formLimits.location.max, 'location') && <p className='invalid-msg'>Invalid</p> }
            <p className='control'>
              <input
                className='input'
                type='text'
                name='location'
                placeholder='Location (Optional)'
                value={this.state.location}
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.location.replace(/ /g, '_'), this.formLimits.location.max, 'location') ? '#9D0600' : '' }} />
            </p>
          </div>
          <div className='field'>
            { InvalidCharChecker(this.state.posterName, this.formLimits.posterName.max, 'posterName') && <p className='invalid-msg'>Invalid</p> }
            <p className='control'>
              <input
                className='input'
                type='text'
                name='posterName'
                placeholder='Your Name (Optional)'
                value={this.state.posterName}
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.posterName, this.formLimits.posterName.max, 'posterName') ? '#9D0600' : '' }} />
            </p>
          </div>

        </div>

        <div className='comment field'>
          { InvalidCharChecker(this.state.content, this.formLimits.content.max, 'content') && <p className='invalid-msg'>Invalid</p> }
          <p className='control'>
            <textarea
              className='textarea'
              name='content'
              placeholder='Enter your comment here* (500 character limit)'
              value={this.state.content}
              onChange={this._handleChange}
              style={{ borderColor: InvalidCharChecker(this.state.content, this.formLimits.content.max, 'content') ? '#9D0600' : '' }} />
          </p>
          <p className='invalid-msg' style={{ color: this.state.content.length <= this.formLimits.content.max ? 'inherit' : '' }}>{this.state.content.length}</p>
        </div>

        <div className='field'>
          <p className='control'>
            <span className='select'>
              <select name='workEnviro' onChange={this._handleChange} value={this.state.workEnviro}>
                <option value=''>Describe your work environment (optional):</option>
                <option value='awesome'>Awesome!</option>
                <option value='alright'>Alright</option>
                <option value='funny'>Comedic</option>
                <option value='sucks'>Sucks!</option>
              </select>
            </span>
          </p>
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
