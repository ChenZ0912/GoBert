import React, { useContext } from 'react';
import { Image, Container } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import Logo from "../util/Graphics/logo.png";
import ShoppingCart from '../components/ShoppingCart';


function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      { user ? (
        <Container>
          <ShoppingCart user={user}/>
        </Container>
      ): (
        <Container text textAlign='center'>
          <Image src={Logo} size='big' centered/>
          <p>LOGIN for more services: view shopping cart, generate schedules... o(*￣▽￣*)ブ</p>
        </Container>
      )}

      <nav className="footer">
        <a href="/about" className='box'>About</a>
        <a href="/about" className='box'>FAQs</a>
        <a href="/about" className='box'>Contact Us</a>
        <p className='box'>@2020 GoBert, Inc.</p>
      </nav>
    </div>
  );
}

export default Home;
