import React from 'react';
import { Form } from 'semantic-ui-react';

function Home(props) {
  function onSubmit(){
    var input = document.getElementById("input").value;
    if (input!=""){
      props.history.push(`/search/${input}`);
    }
  }
  
  return (
    <div className="center">
      <img src="logo.png" alt="LOGO"></img>
      <Form size='large' onSubmit={onSubmit}>
        <Form.Input
          id="input"
          name="input"
          type="text"
          placeholder="Look up a professor or course..."
        />
        <Form.Button type="submit" content='Search' fluid size='large'/>
      </Form>
    </div>
  );
}

export default Home;
