/* eslint-disable unused-imports/no-unused-vars */
'use client';

import {
  CardElement,
  // Elements,
  // PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { firebaseAnalytics } from '@/lib/helper';

import { userAtom } from '@/store/user.atom';

const Payment = () => {
  const [, setUserState] = useRecoilState(userAtom);

  useEffect(() => {
    setUserState((prev) => ({ ...prev, currentPageName: 'Payment' }));
  }, [setUserState]);

  useEffect(() => {
    firebaseAnalytics('page_view');
  }, []);

  const stripePromise = loadStripe(
    process.env.STRIPE_PUBLISHABLE_KEY as string,
  );

  return (
    <div className='flex justify-center items-center w-full'>
      <title>Payment</title>
      {/* <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements> */}

      <script async src='https://js.stripe.com/v3/buy-button.js'></script>

      <stripe-buy-button
        buy-button-id='buy_btn_1PsIZTCEOnME4qy3v30WxUnE'
        publishable-key={process.env.STRIPE_PUBLISHABLE_KEY}
      ></stripe-buy-button>
    </div>
  );
};

export default Payment;

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleSubmit = async (event: any) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='number'
        placeholder='Enter amount'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value='card'>Card</option>
        {/* Add other payment methods if needed */}
      </select>
      <CardElement />
      {/* <PaymentElement/> */}
      <button type='submit' disabled={!stripe}>
        Pay ${amount}
      </button>
    </form>
  );
};
