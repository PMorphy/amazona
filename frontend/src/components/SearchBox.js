import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

const SearchBox = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const submitHandler = (event) => {
    event.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };
  return (
    <Form className='d-flex me-auto' onSubmit={submitHandler}>
      <InputGroup>
        <FormControl
          type='text'
          id='q'
          name='q'
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search Products...'
          aria-label='Search Products'
          aria-describedby='button-search'
        />
        <Button type='submit' variant='outline-primary' id='button-search'>
          <i className='fas fa-search' />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBox;
