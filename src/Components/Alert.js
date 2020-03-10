import React from 'react';

function Alert(props) {
    return (
        <div className='alert'>
            <p className="centered-text">{props.message}</p>
        </div>
    );
};

export default Alert;