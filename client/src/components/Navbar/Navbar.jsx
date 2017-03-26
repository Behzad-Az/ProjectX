import React, {Component} from 'react';

class Navbar extends Component {

  render() {
    return (
      <nav className='nav'>
        <div className='nav-left'>
          <a className='nav-item'>
            <img src='WorkerVentLogo.png' alt='WorkerVent Logo' />
          </a>
        </div>

        <span className='nav-item'>
          <a className='button' href='https://twitter.com/WorkerVent' target='_blank'>
            <span className='icon'>
              <i className='fa fa-twitter'></i>
            </span>
            <span>Twitter</span>
          </a>
        </span>

      </nav>
    );
  }
}

export default Navbar;
