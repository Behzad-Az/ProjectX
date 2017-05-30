import React, {Component} from 'react';
import InvalidCharChecker from '../Partials/InvalidCharChecker.jsx';

class TweetRow extends Component {
  constructor(props) {
    super(props);
    this.formLimits = {
      posterName: { min: 3, max: 15 },
      workLocationHashtag: { min: 3, max: 15 },
      companyHashtag: { min: 3, max: 20 },
      content: { min: 3, max: 500 }
    };
    this.state = {
      posterName: '',
      companyHashtag: '',
      workLocationHashtag: '',
      content: '',
      workEnviro: '',
      showResults: false,
      searchResults: []
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleClear = this._handleClear.bind(this);
    this._validatePosterName = this._validatePosterName.bind(this);
    this._validateLocation = this._validateLocation.bind(this);
    this._validateCompany = this._validateCompany.bind(this);
    this._validateContent = this._validateContent.bind(this);
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
      companyHashtag: '',
      workLocationHashtag: '',
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
    if (this.state.workLocationHashtag) {
      return this.state.workLocationHashtag.length >= this.formLimits.workLocationHashtag.min &&
             this.state.workLocationHashtag[0] === '#' &&
             (this.state.workLocationHashtag.match(/#/g)).length === 1 &&
             !InvalidCharChecker(this.state.workLocationHashtag, this.formLimits.workLocationHashtag.max, 'workLocationHashtag');
    } else {
      return true;
    }
  }

  _validateCompany() {
    return this.state.companyHashtag.length >= this.formLimits.companyHashtag.min &&
           this.state.companyHashtag[0] === '#' &&
           (this.state.companyHashtag.match(/#/g)).length === 1 &&
           !InvalidCharChecker(this.state.companyHashtag, this.formLimits.companyHashtag.max, 'companyHashtag');
  }

  _validateContent() {
    return this.state.content.length >= this.formLimits.content.min &&
           !InvalidCharChecker(this.state.content, this.formLimits.content.max, 'content');
  }

  _validateForm() {
    return this._validatePosterName() &&
           this._validateLocation() &&
           this._validateCompany() &&
           this._validateContent();
  }

  _hanldeCompanySearch(e) {
    const query = e.target.value;
    this.setState({ companyHashtag: query });
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
          searchType: 'companyHashtag'
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
        <p
          key={result._id}
          className='result-row valid'
          onClick={() => this.setState({ companyHashtag: result._source.company_hashtag, showResults: false, searchResults: [] })}
        >
          {result._source.company_hashtag}
        </p>
      );
      this.setState({ searchResults, showResults: true });
    }
  }

  _handleSubmit() {
    const data = {
      posterName: this.state.posterName,
      companyHashtag: this.state.companyHashtag,
      workLocationHashtag: this.state.workLocationHashtag,
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

        <h1 className='header'>Start Venting:</h1>
        <div className='toprow'>

          <div className='search-bar-container control' onBlur={() => setTimeout(() => this.setState({ showResults: false, searchResults: [] }), 100)}>
            <div className='search-bar'>
              <input
                className='input'
                type='text'
                name='companyHashtag'
                placeholder='#Company'
                value={this.state.companyHashtag}
                onChange={this._hanldeCompanySearch}
                style={{ borderColor: !this._validateCompany() ? '#9D0600' : '' }} />
            </div>
            <div className={this.state.showResults ? 'search-bar results is-enabled' : 'search-bar results'}>
              { this.state.searchResults }
            </div>
          </div>

          <div className='control'>
            <input
              className='input'
              type='text'
              name='workLocationHashtag'
              placeholder='#WorkLocation (optional)'
              value={this.state.workLocationHashtag}
              onChange={this._handleChange}
              style={{ borderColor: !this._validateLocation() ? '#9D0600' : '' }} />
          </div>

          <div className='control'>
            <input
              className='input'
              type='text'
              name='posterName'
              placeholder='Your Name (Optional)'
              value={this.state.posterName}
              onChange={this._handleChange}
              style={{ borderColor: !this._validatePosterName() ? '#9D0600' : '' }} />
          </div>
        </div>

        <div className='control comment'>
          <textarea
            className='textarea'
            name='content'
            placeholder='Enter your comment here* (500 character limit)'
            value={this.state.content}
            onChange={this._handleChange}
            style={{ borderColor: !this._validateContent() ? '#9D0600' : '' }} />
          <p className='char-count' style={{ color: this.state.content.length <= this.formLimits.content.max ? 'inherit' : '' }}>{this.state.content.length}</p>
        </div>

        <div className='control is-grouped'>
          <p className='control'>
            <button className='button is-primary' disabled={!this._validateForm()} onClick={this._handleSubmit}>Submit</button>
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

export default TweetRow;
