import React, {Component} from 'react';
import InvalidCharChecker from '../Partials/InvalidCharChecker.jsx';
import SubmitModal from './SubmitModal.jsx';

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
      searchResults: [],
      showSubmitModal: false
    };
    this._handleChange = this._handleChange.bind(this);
    this._clearForm = this._clearForm.bind(this);
    this._validatePosterName = this._validatePosterName.bind(this);
    this._validateLocation = this._validateLocation.bind(this);
    this._validateCompany = this._validateCompany.bind(this);
    this._validateContent = this._validateContent.bind(this);
    this._validateCompanySearchPhrase = this._validateCompanySearchPhrase.bind(this);
    this._validateForm = this._validateForm.bind(this);
    this._hanldeCompanySearch = this._hanldeCompanySearch.bind(this);
    this._conditionCompanySearchResults = this._conditionCompanySearchResults.bind(this);
  }

  _handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  _clearForm() {
    this.setState({
      posterName: '',
      companyHashtag: '',
      workLocationHashtag: '',
      content: '',
      workEnviro: ''
    });
  }

  _validatePosterName() {
    const posterName = this.state.posterName.trim();
    if (posterName) {
      return posterName.length >= this.formLimits.posterName.min &&
             !InvalidCharChecker(posterName, this.formLimits.posterName.max, 'posterName');
    } else {
      return true;
    }
  }

  _validateLocation() {
    const workLocationHashtag = this.state.workLocationHashtag.trim();
    if (workLocationHashtag) {
      return workLocationHashtag.length >= this.formLimits.workLocationHashtag.min &&
             workLocationHashtag[0] === '#' &&
             (workLocationHashtag.match(/#/g)).length === 1 &&
             !InvalidCharChecker(workLocationHashtag, this.formLimits.workLocationHashtag.max, 'workLocationHashtag');
    } else {
      return true;
    }
  }

  _validateCompany() {
    const companyHashtag = this.state.companyHashtag.trim();
    return companyHashtag.length >= this.formLimits.companyHashtag.min &&
           companyHashtag[0] === '#' &&
           (companyHashtag.match(/#/g)).length === 1 &&
           !InvalidCharChecker(companyHashtag, this.formLimits.companyHashtag.max, 'companyHashtag');
  }

  _validateContent() {
    const content = this.state.content.trim();
    return content.length >= this.formLimits.content.min &&
           !InvalidCharChecker(content, this.formLimits.content.max, 'content');
  }

  _validateCompanySearchPhrase() {
    const companyHashtag = this.state.companyHashtag.trim();
    return companyHashtag.length >= this.formLimits.companyHashtag.min &&
           !InvalidCharChecker(companyHashtag, this.formLimits.companyHashtag.max, 'companySearchPhrase');
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
    if (this._validateCompanySearchPhrase()) {
      fetch(`/api/company_search?company=${this.state.companyHashtag.trim().replace('#', '')}`, {
        method: 'GET',
        credentials: 'same-origin'
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

  render() {
    return (

      <div className='new-tweet-form'>
        <SubmitModal
          showModal={this.state.showSubmitModal}
          toggleModal={() => this.setState({ showSubmitModal: !this.state.showSubmitModal })}
          reload={this.props.reload}
          clearForm={this._clearForm}
          posterName={this.state.posterName.trim()}
          companyHashtag={this.state.companyHashtag.trim()}
          workLocationHashtag={this.state.workLocationHashtag.trim()}
          workEnviro={this.state.workEnviro}
          content={this.state.content.trim()} />

        <h1 className='header'>Start Venting:</h1>
        <div className='toprow'>

          <div className='search-bar-container control' onBlur={() => setTimeout(() => this.setState({ showResults: false, searchResults: [] }), 200)}>
            <div className='search-bar'>
              <input
                className='input'
                type='text'
                name='companyHashtag'
                placeholder='#Company*'
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
              placeholder='#WorkLocation (Optional)'
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
          <p className='char-count' style={{ color: this.state.content.trim().length <= this.formLimits.content.max ? 'inherit' : '' }}>{this.state.content.trim().length}</p>
        </div>

        <div className='control'>
          <span className='select'>
            <select className='select' name='workEnviro' onChange={this._handleChange} value={this.state.workEnviro}>
              <option value=''>Work Environment (Optional):</option>
              <option value='awesome'>Awesome place to work in!</option>
              <option value='alright'>The place is alright.</option>
              <option value='funny'>The place is a comedy show.</option>
              <option value='sucks'>This place sucks!</option>
            </select>
          </span>
        </div>

        <div className='control is-grouped'>
          <p className='control'>
            <button
              className='button is-primary'
              disabled={!this._validateForm()}
              onClick={() => this.setState({ showSubmitModal: true })}>
                Preview
            </button>
          </p>
          <p className='control'>
            <button className='button is-link' onClick={this._clearForm}>Clear</button>
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
