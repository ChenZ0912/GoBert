import React, { useContext, useState } from 'react';
import { Card, Dropdown, Grid, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';

const options = [
  { key: 1, text: 'Required', value: "required" },
  { key: 2, text: 'Interested', value: "interested" }
];

function SearchCard({
  result: { category, name, courseID, courseTitle, _id, score, numRate,
    rscore, rnumRate, wouldTakeAgain, levelOfDifficulty }
}) {

  // Search card content
  const { user } = useContext(AuthContext);
  var categoryIcon = "exclamation triangle";
  var link = "/404";
  var title = "";
  if (category === "Course") {
    categoryIcon = "university";
    link = "/rateCourse/"+_id;
    title = courseID + ": " + courseTitle;
  } 
  else if (category === "Professor") {
    categoryIcon = "user circle";
    link = "/rateProf/"+name;
    title = name;
  }

  // Add to shopping cart
  const [add, setAdd] = useState(true);
  const [errors, setErrors] = useState({});
  const [addToCart] = useMutation(ADD_TO_CART_MUTATION, {
    onError(err) {
      setErrors(err.graphQLErrors[0].message);
    }
  });
  function onChange (e, {value}) {
    addToCart({
      variables: {
        username: user.username,
        courseID: courseID,
        courseTitle: courseTitle,
        priority: value,
      }
    })
    setAdd(false);
  }

  return (
    <Card fluid>
      <Card.Content>
      <Grid>
        <Grid.Column width={3} style={{textTransform: "uppercase", fontSize: "15px"}}>
          <Icon name={categoryIcon} style={{color: "#ec2781"}}/> <b>{category}</b>
        </Grid.Column>
        <Grid.Column width={9}>
          <Card.Header style={{fontSize: "15px", fontWeight: "bold"}}>{title}</Card.Header>
        </Grid.Column>
        
        {/*Add to Shopping Card*/}
        {category === "Course" && user && add &&
          <Dropdown
            labeled button selection
            text='Add to Shopping Cart'
            icon='cart'
            className='icon'
            options={options}
            onChange={onChange}
            style={{ margin: "5px", height: "10px",
            color: "white", backgroundColor: "#8900e1" }}
          />
        }
      </Grid>
      </Card.Content>
      <Card.Content as={Link} to={link} style={{backgroundColor: "#f2f2f2"}}>
        <Grid style={{color: "#6d6d6d"}}>
          <Grid.Row>
          <Grid.Column width={3}>
            <Icon name='angle down'/> <b>GoBert</b>
          </Grid.Column>
          <Grid.Column width={10}>
            <span>Score: {score}/5<br/>Number of Ratings: {numRate}</span>
          </Grid.Column>
          </Grid.Row>

          {/*Rate My Professor Info Display*/}
          {category === "Professor" && rnumRate && 
          <Grid.Row>
          <Grid.Column width={3}>
            <Icon name='angle down'/> <b>RateMyProfessor</b>
          </Grid.Column>
          <Grid.Column width={5}>
            <span>Score: {rscore}/5<br/>Number of Ratings: {rnumRate}</span>
          </Grid.Column>
          <Grid.Column width={5}>
            <span>Difficulty Score: {levelOfDifficulty}/5<br/>
              Would Take Again: {wouldTakeAgain}</span>
          </Grid.Column>
          </Grid.Row>}

        </Grid>
      </Card.Content>

      {/*Add to Shopping Card Error*/}
      {Object.keys(errors).length > 0 && (
        <Card.Content style={{backgroundColor: "#fff4f4", color: "#cc0000"}}>
          <li>{errors}</li>
        </Card.Content>
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
