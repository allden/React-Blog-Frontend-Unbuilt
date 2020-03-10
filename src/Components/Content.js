import React from 'react';
import CreateForm from './CreateForm';
import {Link} from 'react-router-dom';

function Content(props) {
    return (
        <div id="content">
            <Posts 
                signedIn={props.signedIn}
                posts={props.posts} 
                togglePublish={props.togglePublish} 
                createPostHandler={props.createPostHandler}
                deleteHandler={props.deleteHandler}
                message={props.message}
                page={props.page}
                changePage={props.changePage}
            />
            <About signedIn={props.signedIn}/>
        </div>
    );
};

function About(props) {
    const message = props.signedIn === true ? <p className="r-b-l p-1">Welcome to the blog! You are currently an administrator.</p> : <p className="r-b-l p-1">This is the visitor view of the page. <br></br> To login, visit this page: <Link to="/login">Login</Link><br></br>Username: admin@example.com<br></br>Password: admin!</p>;
    return (
        <section id="about">
            <div className="content-title dark-bg">
                <h4>About the blog:</h4>
            </div>
            {message}
        </section>
    );
};

function Posts(props) {
    let filtered = props.posts.filter(post => {
        if(props.signedIn) {
            return true
        } else {
            return post.published === true;
        };
    });

    const limit = 3;
    let current = [...filtered].splice(props.page*limit, limit);
    let posts = current.length > 0 ? (current.map(post => (
        <div key={post._id} className="post">
            <div className="content-title">
                <h3 className="centered-text">{post.title}</h3>
            </div>
            <div className="post-content r-l limiter">
                <div className="post-info">
                    <p className="primary-color">By {post.author}</p>
                </div>
                <p>{post.content}</p>
            </div>
            {props.signedIn === true ? (
                <div className="actions">
                    <div className="ud-bar">
                        {
                            post.published ? 
                            <button onClick={() => props.togglePublish(post._id, post.published)} className="ud-ops dark-bg">Unpublish</button> 
                            : <button onClick={() => props.togglePublish(post._id, post.published)} className="ud-ops dark-bg">Publish</button>
                        }
                        <button className="ud-ops dark-bg" onClick={() => props.deleteHandler(post._id)}>Delete</button>
                    </div>
                    <Link to={"/posts/" + post._id}><button className="btn view">View</button></Link>
                </div>
            ) : (
                <div className="actions">
                    <Link to={"/posts/" + post._id}><button className="btn view">View</button></Link>
                </div>
            )}
        </div>
    ))) : (
        <div className="post">
            <div className="content-title">
                <h3 className="centered-text">Nothing here but crickets....</h3>
            </div>
            <div className="post-content centered-text r-b-l limiter">
                <p>Perhaps there'll be posts eventually!</p>
            </div>
        </div>
    )
    
    const createForm = props.signedIn === true ? <CreateForm createPostHandler={props.createPostHandler}/> : null;
    const pagination = Array(Math.ceil(filtered.length/limit)).fill(null).map((current, index) => {
        if(props.page === index) {
            return <li className="current" onClick={() => props.changePage(index)} key={index}>{index}</li>    
        } else {
            return <li onClick={() => props.changePage(index)} key={index}>{index}</li>
        };
    });
    
    const currentAndNext = [...pagination].slice(props.page, props.page+2);
    const prevAndNext = [...pagination].slice(props.page-1, props.page+2);
    return (
        <div className="posts">
            {createForm}
            {posts}
            <ul className="pagination">
                {props.page > 1 && pagination.length > 5 ? pagination[0] : null}
                {pagination.length > 5 ? 
                    (props.page === 0 ?
                        (currentAndNext) :
                        (prevAndNext) 
                    )
                : pagination}
                {props.page < filtered.length-2 && pagination.length > 5 ? pagination[filtered.length-1] : null}
            </ul>
        </div>
    )
};

export {About, Content};