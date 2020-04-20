import React, {useState} from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Button, Card, Checkbox, Container, Divider, Grid, Transition } from 'semantic-ui-react';
import RatingCard from '../components/RatingCard';

function RateProf(props) {
  const name = props.match.params.name;

  const {
    loading,
    error,
    data
  } = useQuery(FETCH_PROF_QUERY, {
    variables: { name },
    onCompleted: data => {
      if (!data["getProfessorDetail"])
        props.history.push('/404');
    }
  });

  // Show error page
  if (error) props.history.push('/404');
  
  const results = error ? {} : data.getProfessorDetail;
  var gobert = "GOBERT - No ratings availble /(ㄒoㄒ)/~~";
  if (results && results.rateSummary && results.rateSummary.length!==0)
    gobert = "GOBERT - Overall Score Based on " + results.rateSummary.length + " Course(s):";

  // Show RMP Tags
  const [ showTag, setShow ] = useState(false);
  function onChange(e, {checked}) { setShow(checked); }
  
  return (
    <Container style={{ marginTop: '7em' }}>
    {loading ? <h1>Loading results..</h1> : <>
      <h1>{results.name}<br/>{results.score}/5</h1>
      <Divider/>

      {/*Rate My Professor Ratings*/}
      { results.rnumRate && <>
        <h3>RATE MY PROFESSOR - Overall Score Based on {results.rnumRate} Rating(s):</h3>
        <Card fluid color="violet">
          <Card.Content>
          <Grid columns={3}>
            <Grid.Column style={{marginTop: "15px"}}> <h3>{results.name}</h3> </Grid.Column>
            <Grid.Column>Difficulty Score: {results.levelOfDifficulty}/5<br/><br/>
              Would Take Again: {results.wouldTakeAgain}
            </Grid.Column>
            <Grid.Column>
              Overall Professor Score: {results.rscore}/5<br/><br/>
              <Checkbox slider label='SHOW TAGS' onChange={onChange}/>
            </Grid.Column>
          </Grid>
          </Card.Content>
          {showTag && 
          <Card.Content>
            <Grid columns={3}>
            <Grid.Row>
              {results.tags &&
                results.tags.map((tag, index) => (
                  <Grid.Column key={index}>
                    <Button fluid style={{color: "white", backgroundColor: "#57068c", 
                      marginTop: "5px"}}>{tag}</Button>
                  </Grid.Column>  
                ))}
              </Grid.Row>
            </Grid>
          </Card.Content>}
        </Card>
        <Divider/>
      </>}
      
      {/*GoBert Ratings*/}
      <h3>{gobert}</h3>
      <Transition.Group>
        {results.rateSummary &&
          results.rateSummary.map((rateSummary, index) => (
            <dl key={index}>
              <RatingCard course_id={rateSummary.course_id} rateSummary={rateSummary} />
            </dl>  
          ))}
      </Transition.Group>
    </>}
    </Container>
  );
}

const FETCH_PROF_QUERY = gql`
  query($name: String!) {
    getProfessorDetail(query: $name) {
      name
      score
      numRate
      rscore
      rnumRate
      wouldTakeAgain
      levelOfDifficulty
      tags
      rateSummary{
        professor
        courseID
        courseTitle
        avgProfScore
        avgCourseScore
        numRate
        course_id
        ratings{
          username
          anonymity
          term
          courseScore
          professorScore
          comment
          upvotes
          downvotes
          _id
        }
      }
    }
  }
`;

export default RateProf;