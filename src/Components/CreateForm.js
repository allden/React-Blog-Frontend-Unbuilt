import React from 'react';

class CreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: ''
        };
    }

    onChangeHandler = (e) => {
        let element = e.target;
        let copyState = {...this.state};
        copyState[element.name] = element.value;
        this.setState({
            ...copyState
        });
    };

    onSubmitHandler = (e) => {
        e.preventDefault();
        this.props.createPostHandler(this.state.title, this.state.content);
        this.setState({
            title: '',
            content: ''
        });
    };

    render() {
        return (
            <div id="post-form">
                <form onSubmit={this.onSubmitHandler}>
                    <label htmlFor="title">Title</label>
                    <input value={this.state.title} onChange={this.onChangeHandler} type="text" id="title" name="title" placeholder="What is your post title?"></input>
                    <label htmlFor="content">Content</label>
                    <textarea value={this.state.content} onChange={this.onChangeHandler} id="content-input" name="content" placeholder="What would you like to share?"></textarea>
                    <button className="btn">Post</button>
                </form>
            </div>
        );
    };
};

export default CreateForm;