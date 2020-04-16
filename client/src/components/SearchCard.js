import React, { useContext, useState } from 'react';
import { Card, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';

function SearchCard({
  result: { name, category, professor, courseID, courseTitle, score, numRate, _id }
}) {
  const { user } = useContext(AuthContext);
  const options = [
      { key: 1, text: 'Required', value: "required" },
      { key: 2, text: 'Interested', value: "interested" },
      { key: 3, text: 'Giveupable', value: "giveupable" }
  ];

  var link = "/404";
  if (category === "Course") {
    link = "/rateCourse/"+_id;
    name = courseID + ": " + courseTitle
  } else if (category === "Professor") {
    link = "/rateProf/"+professor;
    name = professor;
  }

  // Process RMP Data
  if (!numRate) { 
    category = "Professor"; 
    numRate = "From RMP - To be changed - DO NOT CLICK";
  }

  const [add, setAdd] = useState(true);
  const [errors, setErrors] = useState({});
  const [addToCart] = useMutation(ADD_TO_CART_MUTATION, {
    onError(err) {
      setErrors(err.graphQLErrors[0].message);
    }
  });

  function onChange (e, {value}) {
    const course = name.split(': ');
    if (course.length >= 2) {
      addToCart( {
        variables: {
          username: user.username,
          courseID: courseID,
          courseTitle: courseTitle,
          priority: value,
        }
      })
      setAdd(false);
    }
  }

  return (
    <Card fluid color='violet'>
      <Card.Content as={Link} to={link}>
        <Card.Header>{category}</Card.Header>
        <Card.Meta><b>{name}</b></Card.Meta>
        <Card.Description>Score: {score} <br/>Number of Rates: {numRate} </Card.Description>
      </Card.Content>

      {user && category === "Course" && add &&
        <Card.Content extra>
          <Dropdown
            labeled button selection
            text='Add to Shopping Cart'
            icon='cart'
            className='icon'
            options={options}
            onChange={onChange}
            style={{ float: 'right', color: "#489141" }}/>
        </Card.Content>
      }

      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <li>{errors}</li>
        </div>
      )}
    </Card>
  );
}

const ADD_TO_CART_MUTATION = gql`
  mutation addToShoppingCart(
    $username: String!,
    $courseID: String!,
    $courseTitle: String!,
    $priority: String!
  ) {
    addToShoppingCart(
      username: $username,
      courseID: $courseID,
      courseTitle: $courseTitle,
      priority: $priority
    ) {
      courseID
      courseTitle
      score
      numRate
      priority
    }
  }
`;

export default SearchCard;
