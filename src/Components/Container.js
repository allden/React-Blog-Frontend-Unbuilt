import React from 'react';
import {Content} from './Content';
import Alert from './Alert';

function Container(props) {
    return (
        <div id="container">
            {props.message ? <Alert message={props.message} /> : null}
            <Search searchHandler={props.searchHandler}/>
            <Content 
                changePage={props.changePage}
                signedIn={props.signedIn}
                posts={props.posts} 
                message={props.message}
                togglePublish={props.togglePublish} 
                createPostHandler={props.createPostHandler}
                deleteHandler={props.deleteHandler}
                page={props.page}
            />
        </div>
    );
};

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        };
    };

    onChangeHandler = (e) => {
        const {value, id} = e.target;
        this.setState({
            [id]: value
        });
    };

    render() {
        return (
            <div className="search-bar">
                <input value={this.state.search} onChange={this.onChangeHandler} type="text" id="search" name="search" placeholder="Enter a title"></input>
                <button className="btn" onClick={() => this.props.searchHandler(this.state.search)}>Search</button>
            </div>
        );
    };
};

export default Container;