// Libraries ->
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/header.css';
import logo from '../images/ck_logo_small.png';
class HeaderComponent extends Component {
    render() {
        return (
            <>
                <nav className='navbar navbar-expand-sm navbar-dark'>
                    <button
                        className='navbar-toggler'
                        type='button'
                        data-toggle='collapse'
                        data-target='#navbarNav'
                        aria-controls='navbarNav'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                    >
                        <i className='far fa-bars'></i>
                    </button>
                    <div className='mobileLogo'>
                        <img src={logo} alt='*CK'/>
                    </div>
                    <div className='collapse navbar-collapse' id='navbarNav'>
                        <ul className='navbar-nav'>
                            <li className='nav-item'>
                                <NavLink
                                    exact
                                    to='/'
                                    className='item'
                                    style={{ border: 'none' }}
                                >
                                    <img src={logo} alt='*CK'/>
                                </NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink
                                    exact
                                    to='/'
                                    activeClassName='active'
                                    className='item'
                                >
                                    Find Covid Supplies
                                </NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink
                                    to='/volunteer'
                                    activeClassName='active'
                                    className='item'
                                >
                                    Volunteer
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </>
        );
    }
}
export default HeaderComponent;
