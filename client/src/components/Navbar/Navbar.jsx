import React, {Component} from 'react';

class Navbar extends Component {

  render() {
    return (
      <nav className='nav'>
        <div className='nav-left'>
          <a className='nav-item'>
            <img src='../../images/WorkerVentLogo.png' alt='Bulma logo' />
          </a>
        </div>

        <span className='nav-item'>
          <a className='button' href='https://twitter.com/shell_sucks' target='_blank'>
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
