import React, { useState } from 'react';
import { FaHistory, FaTimes, FaFileInvoiceDollar } from 'react-icons/fa';
import ReceiptModal from './ReceiptModal';

const PaymentHistory = ({ client, payments, onClose, formatCurrency }) => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleViewReceipt = (payment) => {
    setSelectedPayment(payment);
    setShowReceipt(true);
  };

  return (
    <>
      <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-content modal-compact modal-large">
          <button onClick={onClose} className="btn-close-top">
            <FaTimes />
          </button>
          <div className="modal-body">
            <div className="modal-header">
              <h2><FaHistory /> Payment History</h2>
            </div>
            <div className="client-info-summary">
              <p><strong>{client.name}</strong> - Plot {client.plot_number} ({client.plot_size || 'N/A'})</p>
              <p>
                Price: {formatCurrency(client.plot_price)} | 
                Paid: {formatCurrency(client.totalPaid)} | 
                Balance: <span className={client.remainingBalance > 0 ? 'remaining-balance' : 'completed-balance'}>
                  {formatCurrency(client.remainingBalance)}
                </span>
              </p>
            </div>
            <div className="table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Receipt No.</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Method</th>
                    <th>Amount</th>
                    <th>Balance</th>
                    <th>Notes</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length > 0 ? (
                    payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="receipt-number">{payment.receipt_number || payment.id?.substring(0, 8).toUpperCase()}</td>
                        <td>{new Date(payment.payment_date).toLocaleDateString('en-NG')}</td>
                        <td>
                          <span className={`payment-type ${payment.payment_type}`}>
                            {payment.payment_type === 'initial_deposit' ? 'Deposit' : `Installment #${payment.installment_number}`}
                          </span>
                        </td>
                        <td>{payment.payment_method?.replace('_', ' ')}</td>
                        <td className="paid-amount">{formatCurrency(payment.amount)}</td>
                        <td className={Number(payment.remaining_balance) > 0 ? 'remaining-balance' : 'completed-balance'}>
                          {formatCurrency(payment.remaining_balance)}
                        </td>
                        <td>{payment.notes || '-'}</td>
                        <td>
                          <button 
                            onClick={() => handleViewReceipt(payment)} 
                            className="btn-icon btn-receipt"
                            title="View Receipt"
                            style={{ color: '#b8860b' }}
                          >
                            <FaFileInvoiceDollar />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="no-data">No payment records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showReceipt && selectedPayment && (
        <ReceiptModal 
          client={client}
          payment={selectedPayment}
          onClose={() => { setShowReceipt(false); setSelectedPayment(null); }}
          formatCurrency={formatCurrency}
        />
      )}
    </>
  );
};

export default PaymentHistory;