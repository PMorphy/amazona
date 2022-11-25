import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import OffcanvasTitle from 'react-bootstrap/OffcanvasTitle';
import OffcanvasHeader from 'react-bootstrap/OffcanvasHeader';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError } from '../util';

const SideMenu = ({ ...props }) => {
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (error) {
        toast.error(getError(error));
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <Button
        variant='light'
        onClick={handleShow}
        className='me-2'
        aria-controls='navbar-side-menu'
      >
        <i className='fas fa-sliders-h' />
      </Button>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement={props.placement}
        {...props}
      >
        <OffcanvasHeader closeButton id='navbar-side-menu'>
          <OffcanvasTitle>
            <strong>Categories</strong>
          </OffcanvasTitle>
        </OffcanvasHeader>
        <Offcanvas.Body>
          <Nav className='d-flex flex-column w-100 p-2'>
            {categories &&
              categories.map((category) => (
                <Nav.Item key={category}>
                  <LinkContainer
                    to={{
                      pathname: '/search',
                      search: `category=${category}`
                    }}
                    onClick={handleClose}
                  >
                    <Nav.Link>{category}</Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default SideMenu;
