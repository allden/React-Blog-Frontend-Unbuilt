import React from 'react';

class LogOut extends React.Component {
    componentDidMount() {
        this.timer = setTimeout(() => {
            localStorage.setItem('jwt', '');
            this.props.toggleLoginState();
            this.props.history.push('/');
        }, 2000);
    };

    componentWillUnmount() {
        clearInterval(this.timer);
    };

    render() {
        return (
            <div className="center-container primary-color">
                <h2 className="large-text centered-text">You have been logged out.</h2>
                <p className="centered-text">Redirecting...</p>
            </div>
        );
    };
};

export default LogOut;