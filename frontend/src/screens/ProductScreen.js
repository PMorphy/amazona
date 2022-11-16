import { useParams, useNavigate } from 'react-router-dom';
import { useReducer, useEffect, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

import Rating from '../components/Rating';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';

import { getError } from '../util';
import { Store } from '../Store';

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, product: payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};

const ProductScreen = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [{ loading, product, error }, dispatch] = useReducer(reducer, {
    loading: true,
    product: {},
    error: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const res = await axios(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };

    fetchProducts();
  }, [slug]);

  const {
    state: { cart },
    dispatch: ctxDispatch
  } = useContext(Store);
  const addToCartHandler = async () => {
    const itemExists = cart.cartItems.find((item) => item._id === product._id);
    const quantity = itemExists ? itemExists.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Oops.  Product is out of stock.');
      return;
    }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity }
    });

    navigate('/cart');
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant='danger'>{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img className='img-large' src={product.image} alt={product.name} />
        </Col>
        <Col md={3}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h2>{product.name}</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            <ListGroup.Item>Price: {product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description: <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Price: </Col>
                    <Col>${product.price}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status: </Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg='success'>In Stock</Badge>
                      ) : (
                        <Badge bg='danger'>Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className='d-grid'>
                      <Button onClick={addToCartHandler} variant='primary'>
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductScreen;
