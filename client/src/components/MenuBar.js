import React, { useContext, useState } from 'react';
import { Menu, Form, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  
  const path = pathname === '/' ? 'home' : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);

  function onSubmit(){
    var input = document.getElementById("input").value;
    if (input!==""){
      //props.history.push(`/search/${input}`);
      window.location.pathname  = ("/search/"+input);
    }
  }

  const menuBar = user ? (
    <Segment inverted>
    <Menu fitted inverted secondary size="massive">
      <Form onSubmit={onSubmit}>
        <Form.Input
          style={{width:"40rem", padding:"5px"}}
          icon="search"
          iconPosition='left'
          id="input"
          name="input"
          type="text"
          placeholder="Look up a professor or course..."
        />
      </Form>

      <Menu.Menu position="right">
        <Menu.Item name={user.username} active as={Link} to="/"/>
        <Menu.Item name="logout" onClick={logout}/>
      </Menu.Menu>
    </Menu>
    </Segment>
  ) : (
    <Segment inverted>
    <Menu fitted inverted secondary size="massive">
      <Form onSubmit={onSubmit}>
        <Form.Input
          style={{width:"40rem", padding:"5px"}}
          icon="search"
          iconPosition='left'
          id="input"
          name="input"
          type="text"
          placeholder="Look up a professor or course..."
        />
      </Form>

      <Menu.Menu position="right">
        <Menu.Item
          name="home"
          active={activeItem === 'home'}
          onClick={handleItemClick}
          as={Link} 
          to="/" 
        />
        <Menu.Item
          name="login"
          active={activeItem === 'login'}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === 'register'}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
    </Segment>
  );
  return menuBar;
}

export default MenuBar;
