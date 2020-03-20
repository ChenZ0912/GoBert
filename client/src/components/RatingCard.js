import React, { useContext } from 'react';
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { FETCH_RATINGS_QUERY } from '../util/graphql';
import { useQuery } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from '../util/MyPopup';

function RatingCard({
  name: name,
  rating: {courseID, courseTitle, avgProfScore, avgCourseScore, numRate }
}) {
  const { user } = useContext(AuthContext);

  const {
    loading,
    data
  } = useQuery(FETCH_RATINGS_QUERY, {
    variables: {
      cID: courseID, 
      cTitle: courseTitle, 
      professor: name
    }
  });

  console.log(data);

  return (
    <Card fluid>
      <Card.Header>{courseID} {courseTitle}</Card.Header>
      <Card.Header>Professor Score: {avgProfScore}/5</Card.Header>
      <Card.Header>Course Score: {avgCourseScore}/5</Card.Header>
    </Card>
  );
}

export default RatingCard;
