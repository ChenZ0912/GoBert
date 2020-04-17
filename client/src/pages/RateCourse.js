import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Container, Divider, Transition } from 'semantic-ui-react';
import RatingCard from '../components/RatingCard';

function RateCourse(props) {
  const id = props.match.params.id;

  const {
    loading,
    data: {getCourseDetail : results}
  } = useQuery(FETCH_COURSE_QUERY, {
    onError() {
      // Show error page
      props.history.push('/404');
    },
    variables: {
      id
    }
  });

  var output = "No ratings availble /(ㄒoㄒ)/~~";
  if (results && results.rateSummary && results.rateSummary.length!==0) {
    output = "Overall Score Based on " + results.rateSummary.length + " Professor(s):";
  }

  return (
    <Container style={{ marginTop: '7em' }}>
      {loading ? (
          <h1>Loading results..</h1>
        ) : (
          <div>
          <h1>{results.courseID} {results.courseTitle}<br/>{results.score}/5</h1>
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
