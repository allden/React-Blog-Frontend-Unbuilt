import React from 'react';
import Alert from './Alert';
import moment from 'moment';
import '../Styles/comment-section.css';
class Comments extends React.Component {
    state = {
        comments: [],
        message: ''
    };

    componentDidMount() {
        this.fetchPost();
    };

    fetchPost = () =>{
        fetch('https://top-blog-backend.herokuapp.com/posts/' + this.props.match.params.id + '/comments')
        .then(res => res.json())
        .then(data => {
            this.setState({
                comments: [...data.comments]
            });
        })
        .catch(err => console.log(err));
    };

    postComment = (name, content) => {
        const opts = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name, content
            })
        };

        fetch('https://top-blog-backend.herokuapp.com/posts/' + this.props.match.params.id + '/comments', opts)
        .then(res => res.json())
        .then(data => {
            if(data.message) {
                clearInterval(this.timer);
                this.setState({
                    message: data.message
                });

                this.timer = setTimeout(() => {
                    this.setState({
                        message: ''
                    });
                }, 2000);
                
                if(data.comment) {
                    this.fetchPost();
                };
            };
        })
        .catch(err => console.log(err));
    };

    componentWillUnmount = () => {
        clearInterval(this.timer);
    };

    deleteComment = (id) => {
        const jwt = localStorage.getItem('jwt');
        const opts = {
            method: 'DELETE',
            headers: {
                'Authorization': jwt
            }
        };

        if(jwt) {
            console.log(`https://top-blog-backend.herokuapp.com/posts/${this.props.match.params.id}/comments/${id}`)
            fetch(`https://top-blog-backend.herokuapp.com/posts/${this.props.match.params.id}/comments/${id}`, opts)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    message: data.message
                });
                this.fetchPost();
            })
            .catch(err => console.log(err));
        } else {
            clearInterval(this.timer);
            this.setState({
                message: 'You need to be signed in to do this.'
            });

            this.timer = setTimeout(() => {
                this.setState({
                    message: ''
                });
            }, 2000);
        };
    };

    render() {
        const message = this.state.message ? <Alert message={this.state.message} /> : null;
        let commentElements = this.state.comments.length > 0 ? this.state.comments.map(comment => {
            return (
                <Comment signedIn={this.props.signedIn} key={comment._id} id={comment._id} deleteComment={this.deleteComment} time={comment.timeOfCreation} name={comment.postedBy} content={comment.content} />
            );
        }) : (
            <div className="primary-bg light-color p-1">
                <p className="centered-text">There are no comments yet.</p>
            </div>
        );

        return (
            <div id="comments">
                <h2 className="primary-color centered-text">Comments</h2>
                {message}
                <CommentForm postComment={this.postComment}/>
                {commentElements}
            </div>
        );
    };
};

function Comment(props) {
    const content = props.signedIn === true ? (
        <div>
            <div className="comment-content p-1 r-l">
                <p>{props.content}</p>
            </div>
            <button onClick={() => props.deleteComment(props.id)} className="btn delete m-0">Delete</button>
        </div>
    ) : (
        <div className="comment-content p-1 r-b-l m-b-1">
            <p>{props.content}</p>
        </div>
    );

    return (
        <div className="comment">
            <div className="content-title h-align-space-btwn p-1-vertical-half">
                <p>By {props.name}</p>
                <p className="time">{moment(props.time).format('lll')}</p>
            </div>
            {content}
        </div>
    );
};

class CommentForm extends React.Component {
    state = {
        content: '',
        name: ''
    };

    onChangeHandler = (e) => {
        const element = e.target;

        this.setState({
            [element.id]: element.value
        });
    };

    onSubmitHandler = (e) => {
        const {name, content} = this.state;

        e.preventDefault();
        this.props.postComment(name, content);

        this.setState({
            content: '',
            name: ''
        });
    };

    render() {
        return (
        <form onSubmit={this.onSubmitHandler} className="comment-section">
            <label htmlFor="name">Name: </label>
            <input 
                onChange={this.onChangeHandler}
                value={this.state.name}
                type="text" 
                id="name" 
                placeholder="What do you want people to refer to you as?">
            </input>
            <label htmlFor="content">Content: </label>
            <textarea 
                onChange={this.onChangeHandler}
                value={this.state.content}
                id="content" 
                placeholder="What do you want to comment?">
            </textarea>
            <button className="btn">Comment</button>
        </form>
        );
    };
};

export default Comments;