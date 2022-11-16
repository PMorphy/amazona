import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { Link, useNavigate } from 'react-router-dom';

import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';

const CartScreen = () => {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems }
  } = state;

  const navigate = useNavigate();

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Oops.  Product is out of stock.');
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h2>Shopping Cart</h2>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is Empty. <Link to='/'>Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className='align-items-center'>
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className='img-fluid rounded img-thumbnail'
                      />{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant='light'
                        disabled={item.quantity === 1}
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                      >
                        <i className='fas fa-minus-circle' />
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant='light'
                        disabled={item.quantity === item.countInStock}
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                      >
                        <i className='fas fa-plus-circle' />
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant='light'
                      >
                        <i className='fas fa-trash' />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <h3>
                    Subtotal (
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                    ) ${' '}
                    {cartItems.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className='d-grid'>
                    <Button
                      type='button'
                      variant='primary'
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}
                    >
                      Proceed to Cart
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartScreen;
