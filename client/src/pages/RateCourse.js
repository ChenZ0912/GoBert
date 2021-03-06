import React, {useState} from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Card, Container, Divider, Transition } from 'semantic-ui-react';
import RatingCard from '../components/RatingCard';
import AddToCart from '../components/AddToCart';

function RateCourse(props) {
  const id = props.match.params.id;

  const {
    loading,
    error,
    data
  } = useQuery(FETCH_COURSE_QUERY, {
    variables: { id }
  });

  // Show 404 page on search error
  if (error) props.history.push('/404');

  // Add to shopping cart error
  const [errors, setErrors] = useState({});

  const results = (data && data.getCourseDetail) ? data.getCourseDetail : {};
  var output = (results && results.rateSummary && results.rateSummary.length!==0) 
    ? "Overall Score Based on " + results.rateSummary.length + " Professor(s):"
    : "No ratings availble /(ㄒoㄒ)/~~";

  return (
    <Container style={{ marginTop: '7em' }}>
      {loading ? (
          <h1>Loading results..</h1>
        ) : (
        <div>
          {/*Add to Shopping Cart*/}
          <AddToCart setErrors={setErrors} courseID={results.courseID} courseTitle={results.courseTitle}/>
        
          <h1>{results.courseID} {results.courseTitle}<br/>{results.score}/5</h1>
          
          {/*Add to Shopping Card Error*/}
          {Object.keys(errors).length > 0 && (
            <Card fluid style={{backgroundColor: "#fff4f4", color: "#cc0000"}}>
              <Card.Content> <li>{errors}</li> </Card.Content>
            </Card>
          )}
          <Divider/>
          <h3>{output}</h3>
          <Transition.Group>
            {results.rateSummary &&
              results.rateSummary.map((rateSummary, index) => (
                <dl key={index}>
                  <RatingCard rateSummary={rateSummary} />
                </dl> 
              ))}
          </Transition.Group>
        </div>
        )}
    </Container>
  );
}

const FETCH_COURSE_QUERY = gql`
  query($id: ID!) {
    getCourseDetail(id: $id) {
      courseID
      courseTitle
      score
      numRate
      rateSummary{
        professor
        courseID
        courseTitle
        avgProfScore
        avgCourseScore
        numRate
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

export default RateCourse;
