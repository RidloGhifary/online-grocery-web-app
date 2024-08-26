'use client';
import React, { useState, useEffect } from 'react';
import { paymentStages, mockCartItems, mockTransactionDetails } from '@/constants/index';
import { MdCancel } from 'react-icons/md';

const PaymentStatusPage: React.FC = () => {
  const [paymentStage, setPaymentStage] = useState('Menunggu Pembayaran');
  const [timeLeft, setTimeLeft] = useState(3600); 
  const [fileUploaded, setFileUploaded] = useState(false);

  useEffect(() => {
    if (paymentStage === 'Menunggu Pembayaran' && !fileUploaded) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      
      if (timeLeft === 0) {
        setPaymentStage('Dibatalkan');
      }

      return () => clearInterval(timer);
    }
  }, [timeLeft, paymentStage, fileUploaded]);

  const handleFileUpload = () => {
    setFileUploaded(true);
    setPaymentStage('Menunggu Konfirmasi Pembayaran');
  };

  const handleCancelTransaction = () => {
    setPaymentStage('Dibatalkan');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentStageIndex = paymentStages.findIndex(stage => stage.label === paymentStage);

  const totalItemPrice = mockCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const subTotal = totalItemPrice + mockTransactionDetails.deliveryPrice;

  return (
    <div className="container mx-auto p-4">
      {/* Transaction ID */}
      <h2 className="text-xl font-bold mb-4">Transaction ID: {mockTransactionDetails.transactionId}</h2>

      {/* Payment Stages */}
      {paymentStage !== 'Dibatalkan' && (
        <div className="relative flex justify-between items-center mb-8">
          {paymentStages.slice(0, paymentStages.length - 1).map((stage, index) => (
            <div key={index} className="relative flex flex-col items-center">
              {/* Icon */}
              <div className={`text-4xl z-10 ${index <= currentStageIndex ? 'text-green-500' : 'text-gray-500'}`}>
                <stage.icon />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancelled Stage */}
      {paymentStage === 'Dibatalkan' && (
        <div className="flex justify-center items-center mb-8">
          <div className="text-4xl text-red-500">
            <MdCancel />
          </div>
        </div>
      )}

      {/* Current Payment Stage */}
      <p className="text-center font-bold text-xl mb-4">{paymentStage !== 'Dibatalkan' ? paymentStages[currentStageIndex]?.label : 'Dibatalkan'}</p>

      {/* Upload and Timer Section */}
      {paymentStage === 'Menunggu Pembayaran' && !fileUploaded && (
        <>
          <p className="mb-4">Time Left: {formatTime(timeLeft)}</p>
          <input type="file" onChange={handleFileUpload} className="mb-4" />
          <button className="btn btn-danger" onClick={handleCancelTransaction}>
            Batalkan Transaksi
          </button>
        </>
      )}

      {/* Detailed Transaction Information */}
      <div className="bg-white p-4 shadow-md rounded-md mb-8">
        <h2 className="text-xl font-bold mb-4">Detailed Transaction Information</h2>
        <p>Items Total Price: Rp {totalItemPrice}</p>
        <p>Delivery Total Price: Rp {mockTransactionDetails.deliveryPrice}</p>
        <p>Sub Total: Rp {subTotal.toFixed(2)}</p>
        <p>Bank Name: {mockTransactionDetails.paymentBank}</p>
        <p>Account ID: {mockTransactionDetails.paymentAccountId}</p>
        <p>Account Name: {mockTransactionDetails.paymentAccountName}</p>
      </div>

      {/* Transaction Items */}
      {mockCartItems.map((item) => (
        <div key={item.id} className="bg-white p-4 shadow-md rounded-md mb-4">
          <div className="flex items-center">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4" />
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Total Price: Rp {(item.price * item.quantity).toFixed(2)}</p>
              <p>Total Weight: {item.weight * item.quantity} kg</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentStatusPage;
