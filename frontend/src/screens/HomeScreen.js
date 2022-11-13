import data from '../data';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  return (
    <Fragment>
      <h1>Featured Products</h1>
      <div className='products'>
        {data.products.map((product) => (
          <div className='product' key={product.slug}>
            <Link to={`/product/${product.slug}`}>
              <img src={product.image} alt={product.name} />
            </Link>
            <div className='product-info'>
              <Link>
                <p>{product.name}</p>
              </Link>
              <p>
                <strong>${product.price}</strong>
              </p>
              <button>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default HomeScreen;
