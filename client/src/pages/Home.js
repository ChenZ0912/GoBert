import React, { useContext } from 'react';
import { AuthContext } from '../context/auth';

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div className="center">
        <img src="logo.png" alt="LOGO"></img>
        {!user && (<p>LOGIN for more services: view shopping cart, generate schedules, etc... o(*￣▽￣*)ブ</p>)}
      </div>

      <nav className='bottom'>
        <a href="/" className='box'>About</a>
        <a href="/" className='box'>FAQs</a>
        <a href="/" className='box'>Contact Us</a>
      </nav>
    </div>
  );
}

export default Home;
