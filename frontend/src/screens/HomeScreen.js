import { Fragment, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import logger from 'use-reducer-logger';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';

import Product from '../components/Product';

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: payload };
    case 'FETC_FAIL':
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};

const HomeScreen = () => {
  const [{ loading, products, error }, dispatch] = useReducer(logger(reducer), {
    loading: true,
    products: [],
    error: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const res = await axios('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: error.message });
      }
    };

    fetchProducts();
  }, []);
  return (
    <Fragment>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className='products'>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <Row>
            {products.map((product) => (
              <Col sm={6} md={4} lg={3} className='mb-3' key={product.slug}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </Fragment>
  );
};

export default HomeScreen;
