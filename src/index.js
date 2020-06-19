import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
// components
import Header from './Components/Header';
import Footer from './Components/Footer';
import Container from './Components/Container';
import LoginForm from './Components/LoginForm';
import LogOut from './Components/LogOut';
import RegisterForm from './Components/RegisterForm';
import Post from './Components/Post';
import NoMatch from './Components/NoMatch';
// styles
import './Styles/about.css';
import './Styles/post.css';
import './Styles/container.css';
import './Styles/general.css';
import './Styles/search.css';
import './Styles/footer.css';
import './Styles/navbar.css';
import './Styles/post-form.css';
import './Styles/mobile.css';
const { Component } = React;

class Blog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            page: 0,
            search: '',
            signedIn: false,
            message: ''
        };
    };

    componentDidMount() {
        this.fetchPosts();
        this.toggleLoginState();
    };

    fetchPosts(message = '') {
        const {search} = this.state;
        fetch(`https://top-blog-backend.herokuapp.com/posts/?search=${search}`)
        .then(response => response.json())
        .then(data => {
            this.setState({
                posts: data.posts,
                message
            });
        })
        .catch(err => console.log(err));
    };
    
    toggleLoginState = () => {
        const jwt = localStorage.getItem('jwt');
        if(jwt && jwt !== '') {
            this.setState({
                signedIn: true,
                page: 0
            });
        } else {
            this.setState({
                signedIn: false,
                page: 0
            });
        };
    };

    // DELETE POST
    deleteHandler = (id) => {
        const jwt = localStorage.getItem('jwt');
        const opts = {
            method: 'DELETE',
            headers: {
                'Authorization': jwt
            }
        }

        if(jwt) {
            fetch('https://top-blog-backend.herokuapp.com/posts/' + id, opts)
            .then(res => res.json())
            .then(data => {
                this.successHandler(data);
            })
            .catch(err => console.log(err));
        } else {
            this.errorHandler();
        };
    };

    // UPDATE POST
    togglePublish = (id, publishState) => {
        const jwt = localStorage.getItem('jwt');
        const opts = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify({
                published: `${!publishState}`
            })
        };

        if(jwt) {
            fetch('https://top-blog-backend.herokuapp.com/posts/' + id, opts)
            .then(res => res.json())
            .then(data => {
                this.successHandler(data);
            })
            .catch(err => console.log(err));
        } else {
            this.errorHandler();
        };
    };

    errorHandler = () => {
        clearInterval(this.timer);
        this.setState({
            message: 'You need to be signed in to perform this action.'
        });
        this.timer = setInterval(() => {
            this.setState({
                message: ''
            })
        }, 2000);
    };

    successHandler = (data) => {
        clearInterval(this.timer);
        this.fetchPosts(data.message);
        this.timer = setInterval(() => {
            this.setState({
                message: ''
            })
        }, 2000);
    };

    // CREATE POST
    createNewPost = (title, content) => {
        let jwt = localStorage.getItem('jwt');
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify({
                title,
                content
            })
        };

        if(jwt) {
            fetch('https://top-blog-backend.herokuapp.com/posts', opts)
            .then(res => res.json())
            .then(data => {
                this.successHandler(data);
            })
            .catch(err => console.log(err));
        } else {
            this.errorHandler();
        };
    };

    changePage = (page) => {
        this.setState({
            page: page
        });
    };

    searchHandler = (val) => {
        this.setState({
            search: val,
            page: 0
        }, this.fetchPosts);
    };

    render() {
        return (
            <div id="parent">
                <BrowserRouter>
                    <Header signedIn={this.state.signedIn}/>
                    <Switch>
                        <Route exact path="/" render={() => {
                            return (<Container 
                                changePage={this.changePage}
                                page={this.state.page}
                                signedIn={this.state.signedIn}
                                posts={this.state.posts} 
                                message={this.state.message}
                                createPostHandler={this.createNewPost}
                                togglePublish={this.togglePublish}
                                deleteHandler={this.deleteHandler}
                                searchHandler={this.searchHandler}
                            >
                            </Container>)
                        }}></Route>
                        <Route exact path="/react-blog" render={() => <Redirect to="/"></Redirect>}></Route>
                        <Route exact path="/React-Blog-Frontend-Unbuilt" render={() => <Redirect to="/"></Redirect>}></Route>
                        <Route exact path="/register" render={(prevProps) => this.state.signedIn ? <RegisterForm {...prevProps}/> : <Redirect to="/"></Redirect>}></Route>
                        <Route exact path="/login" render={(prevProps) => <LoginForm toggleLoginState={this.toggleLoginState} {...prevProps}></LoginForm>}></Route>
                        <Route exact path="/logout" render={(prevProps) => this.state.signedIn ? <LogOut toggleLoginState={this.toggleLoginState} {...prevProps}></LogOut> : <Redirect to="/"></Redirect>}></Route>
                        <Route exact path="/posts/:id" render={(prevProps) => <Post {...prevProps} signedIn={this.state.signedIn}/>}></Route>
                        <Route component={NoMatch}></Route>
                    </Switch>
                    <Footer />
                </BrowserRouter>
            </div>
        );
    };
};

ReactDOM.render(<Blog />, document.getElementById('root'));