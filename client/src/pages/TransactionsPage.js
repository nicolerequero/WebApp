import React, { useEffect, useState } from 'react';
import PageLayout from './PageLayout';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet';
import { CircularProgress } from '@mui/material';
import TransactionsComponent from '../components/transactions/TransactionsComponent';
import Firebase from '../components/helpers/Firebase';

const database=Firebase.database();

const defaultContext = {
  queryResult: { data: null, loading: false, error: null },
  refetch: () => {},
};
const TransactionPageContext = React.createContext(defaultContext);
export const useTransactionPageContext = () => React.useContext(TransactionPageContext);

const TransactionsPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!Cookies.get('admin_id')) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    const ref = database.ref('Transaction/');
    ref.on('value', (snapshot) => {
      if (snapshot.exists()) {
        const snap = snapshot.val();
        const temp = Object.keys(snap).map((key) => snap[key]);
        setTransactions([...temp]);
      } else {
        setTransactions([]);
      }
    });
    return () => ref.off('value');
  }, []);

  const refetch = () => {
    const ref = database.ref('Transaction/');
    ref.once('value', (snapshot) => {
      if (snapshot.exists()) {
        const snap = snapshot.val();
        const temp = Object.keys(snap).map((key) => snap[key]);
        setTransactions([...temp]);
      } else {
        setTransactions([]);
      }
    });
  };

  return (
    <PageLayout headerTitle="Transactions">
      <Helmet>
        <title>Pasabili | Transactions</title>
      </Helmet>
      {transactions.length === 0 ? (
        <div className="my-5">
          <CircularProgress size={80} color="success" />
        </div>
      ) : (
        <TransactionPageContext.Provider value={{ queryResult: { data: transactions, loading: false, error: null }, refetch }}>
          <TransactionsComponent />
        </TransactionPageContext.Provider>
      )}
    </PageLayout>
  );
};

export default TransactionsPage;
