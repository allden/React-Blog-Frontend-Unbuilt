import React from 'react';
import Alert from './Alert';

class RegisterForm extends React.Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password2: '',
        statusMessage: ''
    };

    onChangeHandler = (e) => {
        const element = e.target;
        this.setState({
            [element.id]: element.value
        });
    };

    onSubmitHandler = (e) => {
        e.preventDefault();
        const {firstName, lastName, email, password, password2} = this.state;
        const jwt = localStorage.getItem('jwt');
        const opts = {
            method: 'POST',
            headers: {
                'Authorization': jwt,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
                password2
            })
        };

        if(jwt) {
            fetch('https://top-blog-backend.herokuapp.com/register', opts)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    statusMessage: data.message
                });

                clearInterval(this.statusTimer);
                this.statusTimer = setTimeout(() => {
                    this.setState({
                        statusMessage: ''
                    });
                }, 2000);
            })
            .catch(err => console.log(err));
        } else {
            this.setState({
                statusMessage: 'You need to be logged in to perform this action.'
            });

            clearInterval(this.statusTimer);
            this.statusTimer = setTimeout(() => {
                this.setState({
                    statusMessage: ''
                });
            }, 2000);
        };
    };
    
    componentWillUnmount() {
        clearInterval(this.statusTimer);
    };

    render() {
        const statusMessage = this.state.statusMessage ? <Alert message={this.state.statusMessage} /> : '';
        return (
            <div id="post-form" onSubmit={this.onSubmitHandler} className="center-container">
                <div className="form-container">
                    <h2 className="primary-color centered-text">Register Another User</h2>
                    {statusMessage}
                    <form className="medium-box">
                        <label htmlFor="firstName">First Name: </label>
                        <input 
                            value={this.state.firstName} 
                            onChange={this.onChangeHandler} 
                            type="text" id="firstName" 
                            placeholder="What is your first name?">
                        </input>
                        <label htmlFor="lastName">Last Name: </label>
                        <input 
                            value={this.state.lastName} 
                            onChange={this.onChangeHandler} 
                            type="text" id="lastName" 
                            placeholder="What is your last name?">
                        </input>
                        <label htmlFor="email">Email: </label>
                        <input 
                            value={this.state.email} 
                            onChange={this.onChangeHandler} 
                            type="email" id="email" 
                            placeholder="What is your email?">
                        </input>
                        <label htmlFor="password">Password: </label>
                        <input 
                            value={this.state.password} 
                            onChange={this.onChangeHandler} 
                            type="password" id="password" 
                            placeholder="What is your password?">
                        </input>
                        <label htmlFor="password2">Confirm Password: </label>
                        <input 
                            value={this.state.password2} 
                            onChange={this.onChangeHandler} 
                            type="password" id="password2" 
                            placeholder="Please confirm your password.">
                        </input>
                        <button className="btn">Register</button>
                    </form>
                </div>
            </div>
        );
    };
};

export default RegisterForm;