import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Rating from './Rating';
import { Store } from '../Store';
import axios from 'axios';

const Product = ({
  product,
  product: { name, slug, image, rating, numReviews, price, countInStock }
}) => {
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems }
  } = state;

  const addToCartHandler = async (item) => {
    const itemExists = cartItems.find((item) => item._id === product._id);
    const quantity = itemExists ? itemExists.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Oops.  Product is out of stock.');
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
  };

  return (
    <Card className='product'>
      <Link to={`/product/${slug}`}>
        <img src={image} alt={name} className='card-img-top' />
      </Link>
      <Card.Body>
        <Link to={`/product/${slug}`}>
          <Card.Title>{name}</Card.Title>
        </Link>
        <Rating rating={rating} numReviews={numReviews} />
        <Card.Text>${price}</Card.Text>
        {countInStock === 0 ? (
          <Button variant='light' disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to Cart</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
