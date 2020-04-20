import React, { useState } from 'react';
import { Card, Grid, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import AddToCart from './AddToCart';

function SearchCard({
  result: { category, name, courseID, courseTitle, _id, score, numRate,
    rscore, rnumRate, wouldTakeAgain, levelOfDifficulty }
}) {

  // Search card content
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

  // Add to shopping cart errors
  const [errors, setErrors] = useState({});

  return (
    <Card fluid color='violet'>
      <Card.Content>
      <Grid>
        <Grid.Column width={3} style={{textTransform: "uppercase", fontSize: "15px"}}>
          <Icon name={categoryIcon} style={{color: "#ec2781"}}/> <b>{category}</b>
        </Grid.Column>
        <Grid.Column width={9}>
          <Card.Header style={{fontSize: "15px", fontWeight: "bold"}}>{title}</Card.Header>
        </Grid.Column>
        
        {/*Add to Shopping Cart*/}
        {category === "Course" && 
          <AddToCart setErrors={setErrors} courseID={courseID} courseTitle={courseTitle}/>}
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
          {category === "Professor" && rnumRate !== 0 && rnumRate &&
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

export default SearchCard;
