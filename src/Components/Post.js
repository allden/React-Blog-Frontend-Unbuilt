import React from 'react';
import About from './About';
import Comments from './Comments';

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: ''
        };
    }

    componentDidMount() {
        fetch('https://top-blog-backend.herokuapp.com/posts/' + this.props.match.params.id)
        .then(res => res.json())
        .then(data => {
            this.setState({
                post: {...data.post}
            });
        });
    };

    render() {
        return (
            <div id="container">
                <div id="content">
                    <About signedIn={this.props.signedIn}/>
                    <div className="posts">
                        <div key={this.state.post._id} className="post margin-toggle">
                            <div className="content-title">
                                <h3 className="centered-text">{this.state.post.title}</h3>
                            </div>
                            <div className="post-content r-b-l">
                                <div className="post-info">
                                    <p className="complement-color">By {this.state.post.author}</p>
                                </div>
                                <p>{this.state.post.content}</p>
                            </div>
                        </div>
                        <Comments {...this.props}/>
                    </div>
                </div>
            </div>
        );
    };
};

export default Post;