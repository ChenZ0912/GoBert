import React, { useContext, useState } from 'react';
import { Button, Dropdown } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { AuthContext } from '../context/auth';

const options = [
  { key: 1, text: 'Required', value: "required" },
  { key: 2, text: 'Interested', value: "interested" }
];

function AddToCart(
    {setErrors, courseID, courseTitle}
) {

    const { user } = useContext(AuthContext);
    const [add, setAdd] = useState(true);
    const [addToCart] = useMutation(ADD_TO_CART_MUTATION, {
        onError(err) {
            if (err.graphQLErrors[0])
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
    <>
    {add && <Button.Group color="violet" floated='right'>
        <Dropdown
            labeled button selection
            text='Add to Shopping Cart'
            className='button icon'
            color='violet'
            icon='cart'
            options={options}
            onChange={onChange}
            style={{ margin: "5px", height: "10px" }}
        />
    </Button.Group>}
    </>
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

export default AddToCart;
