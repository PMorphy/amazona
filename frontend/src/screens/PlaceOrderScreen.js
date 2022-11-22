import React, { useContext, useEffect, useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import { toast } from 'react-toastify';
import { getError } from '../util';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    default:
      return state;
  }
};

const PlaceOrderScreen = () => {
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false
  });

  const { dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const {
    state: {
      cart,
      cart: { cartItems, shippingAddress, paymentMethod },
      userInfo
    }
  } = useContext(Store);

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      ctxDispatch({ type: 'CART_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('cartItems');
      navigate(`/order/${data.order._id}`);
    } catch (error) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(error));
    }
  };

  useEffect(() => {
    if (!paymentMethod) {
      navigate('/payment');
    }
  }, [paymentMethod, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h2 className='my-3'>Preview Order</h2>
      <Row>
        <Col md={8}>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name: </strong> {shippingAddress.fullName} <br />
                <strong>
                  Address: <br />
                </strong>{' '}
                {shippingAddress.address} {shippingAddress.city}
                <br />
                {shippingAddress.postal}
                <br />
                {shippingAddress.country}
              </Card.Text>
              <Link to='/shipping'>Edit</Link>
            </Card.Body>
          </Card>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method: </strong> {paymentMethod} <br />
              </Card.Text>
              <Link to='/payment'>Edit</Link>
            </Card.Body>
          </Card>
          <Card className='mb-3'>
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant='flush'>
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className='align-items-center'>
                      <Col md={6}>
                        <img
                          className='img-flush rounded img-thumbnail'
                          src={item.image}
                          alt={item.name}
                        />{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to='/cart'>Edit</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${cart.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${cart.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className='d-grid'>
                    <Button
                      type='button'
                      onClick={placeOrderHandler}
                      disabled={cartItems.length === 0}
                    >
                      Place Order
                    </Button>
                  </div>
                  {loading && <LoadingBox></LoadingBox>}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
