import React, { useContext, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../util';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

const ProfileScreen = () => {
  const {
    state: { userInfo },
    dispatch: ctxDispatch
  } = useContext(Store);

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [dispatch] = useReducer(reducer, {
    loadingUpdate: false,
    error: ''
  });

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    dispatch({ type: 'UPDATE_REQUEST' });
    try {
      const { data } = await axios.put(
        `/api/users/profile`,
        {
          name,
          email,
          password
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` }
        }
      );

      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({ type: 'USER_SIGN_IN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User Updated Successfully');
    } catch (error) {
      dispatch({ type: 'UPDATE_FAIL' });
      toast.error(getError(error));
    }
  };
  return (
    <div className='container small-container'>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h2 className='my-3'>User Profile</h2>
      <form onSubmit={onSubmitHandler}>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            value={confirmPassword}
            type='password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className='mb-3'>
          <Button type='submit'>Update</Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileScreen;
