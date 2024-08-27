'use client';
import React, { useState, useEffect } from 'react';
import { paymentStages, mockCartItems, mockTransactionDetails } from '@/constants/index';
import { MdArrowBack, MdCancel } from 'react-icons/md';
import PaymentDetail from './components/PaymentDetail';
import TransactionItemsTable from './components/TransactionItemsTable';
import MainLink from '@/components/MainLink';

const PaymentStatusPage: React.FC = () => {
  const [paymentStage, setPaymentStage] = useState('Menunggu Pembayaran');
  const [timeLeft, setTimeLeft] = useState(3600);
  const [fileUploaded, setFileUploaded] = useState(false);
  useEffect(() => {
    if (paymentStage === 'Menunggu Pembayaran' && !fileUploaded) {
      const timer = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
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
      <MainLink href="/transaction-history" text="Back to Transaction History" Icon={MdArrowBack} />
      {/* Detailed Payment Information */}
      <PaymentDetail
        totalItemPrice={totalItemPrice}
        deliveryPrice={mockTransactionDetails.deliveryPrice}
        subTotal={subTotal}
        paymentBank={mockTransactionDetails.paymentBank}
        paymentAccountId={mockTransactionDetails.paymentAccountId}
        paymentAccountName={mockTransactionDetails.paymentAccountName}
      />
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
      <p className="text-center font-bold text-xl mb-4">
        {paymentStage !== 'Dibatalkan' ? paymentStages[currentStageIndex]?.label : 'Dibatalkan'}
      </p>
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
      {/* Transaction Items */}
      <TransactionItemsTable items={mockCartItems} />
    </div>
  );
};

export default PaymentStatusPage;
