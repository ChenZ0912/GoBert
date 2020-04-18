import React from 'react';
import notFound from "../util/Graphics/notFound.png";

function NotFound() {
    return (
        <img src={notFound} alt="404" className = "center" />
    );
}

export default NotFound;