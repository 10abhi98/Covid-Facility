// Libraries ->
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "../styles/header.css";

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
                    <div className='collapse navbar-collapse' id='navbarNav'>
                        <ul className='navbar-nav'>
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
