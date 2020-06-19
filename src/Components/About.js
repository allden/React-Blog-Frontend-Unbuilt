import React from 'react';
import {Link} from 'react-router-dom';

function About(props) {
    const message = props.signedIn === true ? <p>Welcome to the blog! You are currently an administrator.</p> : <p>This is the visitor view of the page. <br></br> To login, visit this page: <Link to="/login">Login</Link></p>;
    const listOfClasses = 'about primary-bg';
    return (
        <section className={listOfClasses}>
            {message}
        </section>
    );
};

export default About;