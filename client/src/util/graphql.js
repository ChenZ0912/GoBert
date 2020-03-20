import gql from 'graphql-tag';

export const FETCH_RATINGS_QUERY = gql`
  {
    getRatings(
      searchCourseInput: {
        cID: $cID
        cTitle: $cTitle
        professor: $professor
      }
    ){
      username
      anonymity
      courseID
      courseTitle
      term
      courseScore
      professor
      professorScore
      comment
      upvotes
      downvotes
      createdAt
      id
    }
  }
`;
