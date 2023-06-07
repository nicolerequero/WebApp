import React, { useEffect, useState, useContext } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import PageLayout from './PageLayout';
import useAxios from 'axios-hooks'
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet';
import WithdrawalRequestComponent from '../components/withdrawalRequests/WithdrawalRequestComponent';
import ApprovedWithdrawalRequestComponent from '../components/withdrawalRequests/ApprovedWithdrawalRequestComponent';

const defaultContext = {
    queryResult: { data: null, loading: false, error: null },
    refetch: () => { },
};
const WithdrawalRequestPageContext = React.createContext(defaultContext);
export const useWithdrawalRequestPageContext = () => useContext(WithdrawalRequestPageContext);
const WithdrawalRequestPage = () => {

    // check if admin has login otherwise redirect to login
    const navigate = useNavigate();
    useEffect(() => {
        if (!Cookies.get('admin_id')) {
            navigate("/login");
        }
    }, [])

    const [value, setValue] = useState(0);

    // fetch all withdrawal request
    const [{ data, loading, error }, refetch] = useAxios({
        url: `${process.env.REACT_APP_BACKEND_URL}/admin/withdrawalRequest`,
        method: 'get'
    });

    useEffect(() => {
        refetch();
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };
    return (
        <PageLayout headerTitle="Withdrawal Requests">
            <Helmet>
                <title>Pasabili | Withdrawal Requests</title>
            </Helmet>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab style={{ fontWeight: 600 }} label="Pending Withdrawal Requests" {...a11yProps(0)} />
                    <Tab style={{ fontWeight: 600 }} label="Approved Withdrawal Requests" {...a11yProps(1)} />
                </Tabs>
            </Box>
            {loading ? (
                <div className="my-5">
                    <CircularProgress size={80} color="success" />
                </div>
            ) : (
                <WithdrawalRequestPageContext.Provider value={{ queryResult: { data, loading, error }, refetch }}>

                    <TabPanel value={value} index={0}>
                        <WithdrawalRequestComponent />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <ApprovedWithdrawalRequestComponent />
                    </TabPanel>
                </WithdrawalRequestPageContext.Provider>
            )}
        </PageLayout>
    )
}

export default WithdrawalRequestPage
