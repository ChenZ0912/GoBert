import React, { useContext } from 'react';
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from '../util/MyPopup';

function ResultCard({
  result: { category, name, score, numRate}
}) {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>{category}</Card.Header>
        <Card.Meta as={Link} to={`/rate/${name}`}><b>{name}</b></Card.Meta>
        <Card.Description>Score: {score} <br/>Number of Rates: {numRate} </Card.Description>
      </Card.Content>
    </Card>
  );
}

export default ResultCard;
