import React, { useState, useEffect } from 'react'
import PageLayout from "./PageLayout";


import { Paper, Grid, Button } from '@mui/material';

import DashboardCard from '../components/dashboard/DashboardCard'
import PersonIcon from "@mui/icons-material/Person";
import Chart from '../components/ChartComponent';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PeopleIcon from '@mui/icons-material/People';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Axios from "axios";
import Firebase from '../components/helpers/Firebase';
import moment from 'moment';

const database = Firebase.database();

const DashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const ref = database.ref('Transaction/');
    const onValue = (snapshot) => {
      if (snapshot.exists()) {
        const snap = snapshot.val();
        const temp = Object.keys(snap).map((key) => snap[key]);
        setTransactions([...temp]);
      } else {
        setTransactions([]);
      }
    };
    ref.on('value', onValue);
    return () => ref.off('value', onValue);
  }, []);


  // Define the start and end dates of the current month
  const today = moment();
  const startDate = today.startOf('month').toDate();
  const endDate = today.endOf('month').toDate();

// Group transactions by week
const transact = transactions
  .filter((item) => {
    // Filter out transactions outside the current month or without details
    const date = new Date(item.reqDDate.time);
    return date >= startDate && date <= endDate && item.details;
  })
  .reduce((acc, item) => {
    const date = new Date(item.reqDDate.time);
    const week = moment(date).isoWeek();
    const year = moment(date).isoWeekYear();
    const totalAmount = item.details.reduce((sum, detail) => {
      return sum + detail.price * detail.qty;
    }, 0);
    if (!acc[year]) acc[year] = {};
    if (!acc[year][week]) acc[year][week] = { totalAmount: 0, count: 0 };
    acc[year][week].totalAmount += totalAmount;
    acc[year][week].count++;
    return acc;
  }, {});



  // Calculate the average totalAmount for each week
  const chartData = Object.keys(transact).map((year) => {
    return Object.keys(transact[year]).map((week) => {
      const weekData = transact[year][week];
      const averageTotalAmount =  Number((weekData.totalAmount / weekData.count).toFixed(2));
      const startDate = moment().isoWeekYear(year).isoWeek(week).startOf('isoWeek').toDate();
      const endDate = moment().isoWeekYear(year).isoWeek(week).endOf('isoWeek').toDate();
      return {
        date: `${moment(startDate).format('MMM DD')} - ${moment(endDate).format('MMM DD')}`,
        averageTotalAmount: averageTotalAmount,
      };
    });
  }).flat();

  console.log(chartData);


  useEffect(() => {
    if (Cookies.get('admin_id')) {
      Axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/dashboard`, { accessToken: Cookies.get('admin_id') })
        .then((res) => {
          if (res) {
            setData(res.data);
          }
        })
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const dashcards = [
    { id: 1, title: "New Users", count: data?.data?.activeCustomersCount ?? 0, icon: <PeopleIcon style={{ float: 'right' }} fontSize="large" /> },
    { id: 2, title: "Banned Users", count: data?.data?.inactiveCustomersCount ?? 0, icon: <NoAccountsIcon style={{ float: 'right' }} fontSize="large" /> },
    { id: 3, title: "Itinerants", count: data?.data?.activeItinerantsCount ?? 0, icon: <PersonPinIcon style={{ float: 'right' }} fontSize="large" /> },
    { id: 4, title: "Verified Users", count: 6, icon: <VerifiedUserIcon style={{ float: 'right' }} fontSize="large" /> },
    { id: 5, title: "Transactions", count: transactions && transactions.length, icon: <ReceiptIcon style={{ float: 'right' }} fontSize="large" /> },
  ]

  return (
    <PageLayout headerTitle={"Dashboard"}>
      <div>
        <Grid container spacing={3}>
          {dashcards.map(dashcard => (
            <Grid item key={dashcard.id} xs={12} md={6} lg={3}>
              <DashboardCard id={dashcard.id} data={data} title={dashcard.title} count={dashcard.count} icon={dashcard.icon} />
            </Grid>
          ))}
          {/* Chart */}
          <Grid item xs={12} sx={{ mt: 4, mb: 4 }}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 280,
                maxWidth: 'lg'
              }}
            >
             {chartData && <Chart data={chartData} />}
            </Paper>
          </Grid>

        </Grid>
      </div>
    </PageLayout>
  );
};

export default DashboardPage;
