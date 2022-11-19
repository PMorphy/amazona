import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import { Store } from '../Store';

const PaymentMethodScreen = () => {
  const {
    state: {
      cart: { shippingAddress, paymentMethod }
    },
    dispatch
  } = useContext(Store);

  const navigate = useNavigate();
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );

  const onSubmitHandler = (event) => {
    event.preventDefault();
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className='container small-container'>
        <Helmet>
          <title>Payment</title>
        </Helmet>
        <h2 className='my-3'>Payment</h2>
        <Form onSubmit={onSubmitHandler}>
          <div className='mb-3'>
            <Form.Check
              type='radio'
              id='PayPal'
              value='PayPal'
              label='PayPal'
              checked={paymentMethodName === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <Form.Check
              type='radio'
              id='Stripe'
              value='Stripe'
              label='Stripe'
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className='mb-3'>
            <Button type='submit'>Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PaymentMethodScreen;
