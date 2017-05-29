import React, {Component} from 'react';
import InvalidCharChecker from '../Partials/InvalidCharChecker.jsx';

class TweetBox extends Component {
  constructor(props) {
    super(props);
    this.formLimits = {
      posterName: { min: 3, max: 15 },
      workLocation: { min: 3, max: 15 },
      companyName: { min: 3, max: 20 },
      content: { min: 3, max: 500 }
    };
    this.state = {
      posterName: '',
      companyName: '',
      workLocation: '',
      content: '',
      workEnviro: '',
      showResults: false,
      searchResults: []
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleClear = this._handleClear.bind(this);
    this._validatePosterName = this._validatePosterName.bind(this);
    this._validateWorkLocation = this._validateWorkLocation.bind(this);
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
      companyName: '',
      workLocation: '',
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

  _validateWorkLocation() {
    if (this.state.workLocation) {
      return this.state.workLocation.length >= this.formLimits.workLocation.min &&
             !InvalidCharChecker(this.state.workLocation.replace(/ /g, '_'), this.formLimits.workLocation.max, 'workLocation');
    } else {
      return true;
    }
  }

  _validateForm() {
    return this._validatePosterName() &&
           this._validateWorkLocation() &&
           this.state.companyName.length >= this.formLimits.companyName.min &&
           !InvalidCharChecker(this.state.companyName.replace(/ /g, '_'), this.formLimits.companyName.max, 'companyName') &&
           this.state.content.length >= this.formLimits.content.min &&
           !InvalidCharChecker(this.state.content, this.formLimits.content.max, 'content');
  }

  _hanldeCompanySearch(e) {
    const query = e.target.value;
    this.setState({ companyName: query });
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
        <p key={result._id} className='result-row valid' onClick={() => this.setState({ companyName: result._source.company_name, showResults: false, searchResults: [] })}>
          <i className='fa fa-briefcase' /> {result._source.company_name}
        </p>
      );
      this.setState({ searchResults, showResults: true });
    }
  }

  _handleSubmit() {
    const data = {
      posterName: this.state.posterName,
      companyName: this.state.companyName,
      workLocation: this.state.workLocation,
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
    return (
      <div className='new-tweet-form'>

        <div className='toprow'>

          <div className='field'>
            { InvalidCharChecker(this.state.companyName.replace(/ /g, '_'), this.formLimits.companyName.max, 'companyName') && <p className='invalid-msg'>Invalid</p> }
            <div className='search-bar-container'>
              <p className='search-bar control'>
                <input
                  className='input'
                  type='text'
                  name='companyName'
                  placeholder='Company*'
                  value={this.state.companyName}
                  onChange={this._hanldeCompanySearch}
                  style={{ borderColor: InvalidCharChecker(this.state.companyName.replace(/ /g, '_'), this.formLimits.companyName.max, 'companyName') ? '#9D0600' : '' }} />
              </p>
              <div className={this.state.showResults ? 'search-bar results is-enabled' : 'search-bar results'}>
                { this.state.searchResults }
              </div>
            </div>
          </div>

          <div className='field'>
            { InvalidCharChecker(this.state.workLocation.replace(/ /g, '_'), this.formLimits.workLocation.max, 'workLocation') && <p className='invalid-msg'>Invalid</p> }
            <p className='control'>
              <input
                className='input'
                type='text'
                name='workLocation'
                placeholder='Work Location (Optional)'
                value={this.state.workLocation}
                onChange={this._handleChange}
                style={{ borderColor: InvalidCharChecker(this.state.workLocation.replace(/ /g, '_'), this.formLimits.workLocation.max, 'workLocation') ? '#9D0600' : '' }} />
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
