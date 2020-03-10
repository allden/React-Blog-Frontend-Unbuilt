import React from 'react';
import {NavLink, Link} from 'react-router-dom';

class Header extends React.Component {
    render() {
        const login = this.props.signedIn === true ? <NavLink to="/logout"><li className="nav-btn">Log Out</li></NavLink> : <NavLink to="/login"><li className="nav-btn">Login</li></NavLink>
        const nav = this.props.signedIn === true ? (
            <ul>
                <NavLink exact to="/"><li className="nav-btn">Home</li></NavLink>
                <NavLink to="/register"><li className="nav-btn">Register</li></NavLink>
                {login}
            </ul>
            ) : null;
        return (
            <header id="navbar">
                <Link to="/"><h1 className="title">Blog</h1></Link>
                {nav}
            </header>
        );
    };
};

export default Header;