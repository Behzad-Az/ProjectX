import React, {Component} from 'react';
import TweetRow from './TweetRow.jsx';
import InvalidCharChecker from '../Partials/InvalidCharChecker.jsx';

class TweetsContainer extends Component {
  constructor(props) {
    super(props);
    this.formLimits = {
      companyFilter: { min: 3, max: 20 }
    };
    this.state = {
      dataLoaded: false,
      pageError: false,
      companyFilter: '',
      tweets: [],
      noMoreFeeds: false
    };
    this._loadComponentData = this._loadComponentData.bind(this);
    this._conditionData = this._conditionData.bind(this);
    this._validateCompanyFilter = this._validateCompanyFilter.bind(this);
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

  _loadComponentData(freshReload, companyFilter) {
    fetch(`/api/index?tweetsoffset=${freshReload ? 0 : this.state.tweets.length}&company=${companyFilter || '_all'}`, {
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

  _validateCompanyFilter() {
    return this.state.companyFilter.length >= this.formLimits.companyFilter.min &&
           !InvalidCharChecker(this.state.companyFilter, this.formLimits.companyFilter.max, 'companyFilter');
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
                onChange={e => this.setState({ companyFilter: e.target.value })}
                placeholder='Search company name here'
                style={{ color: InvalidCharChecker(this.state.companyFilter, this.formLimits.companyFilter.max, 'companyFilter') ? '#9D0600' : '' }} />
              <button disabled={!this._validateCompanyFilter()} onClick={() => this._loadComponentData(true, this.state.companyFilter)}>Search</button>
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
