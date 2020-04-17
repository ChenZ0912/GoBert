import React from 'react';
import notFound from "../util/Graphics/notFound.png";

function NotFound() {
    return (
        <a href="/">
            <img src={notFound} alt="404" className = "center" />
        </a>
    );
}

export default NotFound;