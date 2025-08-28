import React from 'react';
import { useAppStore } from '../../state/useAppStore';
import './PayButton.css';

export default function PayButton({ amount, currency, status, onPaid }) {
  const startPayment = useAppStore(s => s.startPayment);

  const handleClick = async () => {
    await startPayment();      // later: call Daraja STK push via your backend
    onPaid?.();
  };

  return (
    <button className="btn btn-primary" onClick={handleClick} disabled={status === 'pending'}>
      {status === 'pending' ? 'Processing…' : `Pay ${amount} ${currency}`}
    </button>
  );
}
