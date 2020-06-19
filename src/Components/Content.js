import React from 'react';
import CreateForm from './CreateForm';
import {Link} from 'react-router-dom';
import About from './About';

function Content(props) {
    return (
        <div id="content">
            <About signedIn={props.signedIn} message={props.message}/>
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
        </div>
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
                    <p className="complement-color">By {post.author}</p>
                </div>
                <p>{post.content}</p>
            </div>
            {props.signedIn === true ? (
                <div className="actions">
                    <div className="ud-bar">
                        {
                            post.published ? 
                            <button onClick={() => props.togglePublish(post._id, post.published)} className="ud-ops complement-bg">Unpublish</button> 
                            : <button onClick={() => props.togglePublish(post._id, post.published)} className="ud-ops complement-bg">Publish</button>
                        }
                        <button className="ud-ops complement-bg" onClick={() => props.deleteHandler(post._id)}>Delete</button>
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