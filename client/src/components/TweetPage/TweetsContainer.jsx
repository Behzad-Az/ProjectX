import React, {Component} from 'react';
import TweetRow from './TweetRow.jsx';
import InvalidCharChecker from '../Partials/InvalidCharChecker.jsx';

class TweetsContainer extends Component {
  constructor(props) {
    super(props);
    this.formLimits = {
      companySearchPhrase: { min: 3, max: 20 }
    };
    this.state = {
      dataLoaded: false,
      pageError: false,
      companySearchPhrase: '',
      tweets: [],
      noMoreFeeds: false
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._validateCompanySearchPhrase = this._validateCompanySearchPhrase.bind(this);
    this._renderLoadMoreBtn = this._renderLoadMoreBtn.bind(this);
    this._renderPageAfterData = this._renderPageAfterData.bind(this);
  }

  componentDidMount() {
    this._loadComponentData(false);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.parentState !== this.state.parentState) {
      this.setState({ parentState: nextProps.parentState });
      this._loadComponentData(true);
    }
  }

  _loadComponentData(freshReload) {
    fetch(`/api/index?tweetsoffset=${freshReload ? 0 : this.state.tweets.length}&company=${this.state.companySearchPhrase.trim().replace('#', '')}`, {
      method: 'GET',
      credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(resJSON => this._conditionData(resJSON, freshReload))
    .catch(() => this.setState({ dataLoaded: true, pageError: true }));
  }

  _conditionData(resJSON, freshReload) {
    if (resJSON) {
      this.setState({
        tweets: freshReload ? resJSON.tweets : this.state.tweets.concat(resJSON.tweets),
        dataLoaded: true,
        noMoreFeeds: !resJSON.tweets.length
      });
    } else {
      throw 'Server returned false.';
    }
  }

  _validateCompanySearchPhrase() {
    return !this.state.companySearchPhrase.length ||
           (this.state.companySearchPhrase.length >= this.formLimits.companySearchPhrase.min &&
           !InvalidCharChecker(this.state.companySearchPhrase, this.formLimits.companySearchPhrase.max, 'companySearchPhrase'));
  }

  _renderLoadMoreBtn() {
    if (this.state.tweets.length) {
      const btnContent = this.state.noMoreFeeds && this.state.tweets.length ? 'All tweets loaded' : 'Load more';
      return (
        <p className='end-msg'>
          <button className='button' disabled={this.state.noMoreFeeds} onClick={() => this._loadComponentData(false)}>{btnContent}</button>
        </p>
      );
    } else {
      return <p>No work vent posted yet...</p>;
    }
  }

  _renderPageAfterData() {
    if (this.state.dataLoaded && this.state.pageError) {
      return (
        <p className='page-msg'>
          <i className='fa fa-exclamation-triangle' aria-hidden='true' />
          Error in loading up the page
        </p>
      );
    } else if (this.state.dataLoaded) {
      return (
        <div className='tweets-container'>
          <h1 className='header'>
            Previous Vents:
            <div className='company-search'>
              <input
                type='text'
                onChange={e => this.setState({ companySearchPhrase: e.target.value })}
                placeholder='Search company name here'
                style={{ color: InvalidCharChecker(this.state.companySearchPhrase, this.formLimits.companySearchPhrase.max, 'companySearchPhrase') ? '#9D0600' : '' }} />
              <button disabled={!this._validateCompanySearchPhrase()} onClick={() => this._loadComponentData(true)}>Search</button>
            </div>
          </h1>
          { this.state.tweets.map(tweet => <TweetRow key={tweet.id} tweet={tweet} />) }
          { this._renderLoadMoreBtn() }
        </div>
      );
    } else {
      return (
        <p className='page-msg'>
          <i className='fa fa-spinner fa-spin fa-3x fa-fw' />
          <span className='sr-only'>Loading...</span>
        </p>
      );
    }
  }

  render() {
    return this._renderPageAfterData();
  }
}

export default TweetsContainer;
