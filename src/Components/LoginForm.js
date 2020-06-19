import React from 'react';
import Alert from './Alert';

class LoginForm extends React.Component {
    state = {
        username: 'admin@example.com',
        password: 'admin!',
        statusMessage: ''
    };

    onChangeHandler = (e) => {
        let element = e.target;
        let copyState = {...this.state};
        copyState[element.name] = element.value;
        this.setState({
            ...copyState
        });
    };

    loginPost = async(e) => {
        e.preventDefault();
        let opts = {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email: this.state.username,
                password: this.state.password
            })
        };

        await fetch('https://top-blog-backend.herokuapp.com/login', opts)
        .then(res => res.json())
        .then(data => {
            if(data.token) {
                localStorage.setItem('jwt', 'Bearer ' + data.token);
                this.props.toggleLoginState();
                this.setState({
                    statusMessage: data.message + ' Redirecting you...'
                });
                this.timer = setTimeout(() => {
                    this.props.history.push('/');
                }, 2000);
            } else {
                this.setState({
                    statusMessage: data.message
                });

                clearInterval(this.statusTimer);
                this.statusTimer = setTimeout(() => {
                    this.setState({
                        statusMessage: ''
                    });
                }, 2000);
            };
        })
        .catch(err => console.log(err));
    };

    componentWillUnmount() {
        clearInterval(this.timer);
        clearInterval(this.statusTimer);
    };

    render() {
        let statusMessage = this.state.statusMessage ? <Alert message={this.state.statusMessage}/> : null;
        return (
            <div id="post-form" className="center-container">
                <div className="form-container">
                    <h2 className="primary-color centered-text">Please Sign In</h2>
                    {statusMessage}
                    <form className="medium-box" onSubmit={this.loginPost}>
                        <label htmlFor="username">Username (Email)</label>
                        <input value={this.state.username} onChange={this.onChangeHandler} type="email" id="username" name="username" placeholder="What is your username?"></input>
                        <label htmlFor="password">Password</label>
                        <input value={this.state.password} onChange={this.onChangeHandler} type="password" id="password" name="password" placeholder="What is your password?"></input>
                        <button className="btn">Login</button>
                    </form>
                </div>
            </div>
        );
    };
};

export default LoginForm;