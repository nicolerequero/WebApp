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
import UserVerificationComponent from '../components/verifications/UserVerificationComponent';

const defaultContext = {
    queryResult: { data: null, loading: false, error: null },
    refetch: () => { },
};
const UserVerificationPageContext = React.createContext(defaultContext);
export const useUserVerificationPageContext = () => useContext(UserVerificationPageContext);
const UserVerificationPage = () => {

    // check if admin has login otherwise redirect to login
    const navigate = useNavigate();
    useEffect(() => {
        if (!Cookies.get('admin_id')) {
            navigate("/login");
        }
    }, [])

    const [value, setValue] = useState(0);

    // fetch all verification
    const [{ data, loading, error }, refetch] = useAxios({
        url: `${process.env.REACT_APP_BACKEND_URL}/admin/verification`,
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
        <PageLayout headerTitle="Verifications">
            <Helmet>
                <title>Pasabili | Verifications</title>
            </Helmet>
            {loading ? (
                <div className="my-5">
                    <CircularProgress size={80} color="success" />
                </div>
            ) : (
                <UserVerificationPageContext.Provider value={{ queryResult: { data, loading, error }, refetch }}>
                    <UserVerificationComponent />
                </UserVerificationPageContext.Provider>
            )}
        </PageLayout>
    )
}

export default UserVerificationPage
