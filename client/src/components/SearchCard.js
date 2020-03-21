import React from 'react';
import { Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function SearchCard({
  result: { category, name, score, numRate, _id}
}) {

  var link = "/";
  if (category === "Course") {
    link = "/rateCourse/"+_id;
  } else if (category === "Professor") {
    link = "/rateProf/"+name;
  }

  return (
    <Card fluid as={Link} to={link} color='violet'>
      <Card.Content>
        <Card.Header>{category}</Card.Header>
        <Card.Meta><b>{name}</b></Card.Meta>
        <Card.Description>Score: {score} <br/>Number of Rates: {numRate} </Card.Description>
      </Card.Content>
    </Card>
  );
}

export default SearchCard;
