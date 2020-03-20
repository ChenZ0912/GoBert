import React, { useContext } from 'react';
import { Image, Container } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';

function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Container text textAlign='center'>
        <Image src='logo.png' size='big' centered/>
        {!user && (<p>LOGIN for more services: view shopping cart, generate schedules... o(*￣▽￣*)ブ</p>)}
      </Container>

      <nav className='bottom'>
        <a href="/" className='box'>About</a>
        <a href="/" className='box'>FAQs</a>
        <a href="/" className='box'>Contact Us</a>
        <p className='box'>@2020 GoBert, Inc.</p>
      </nav>
    </div>
  );
}

export default Home;
