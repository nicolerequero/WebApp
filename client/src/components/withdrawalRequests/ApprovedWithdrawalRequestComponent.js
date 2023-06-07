import React, { useEffect, useState } from 'react'
import MUIDataTable from "mui-datatables";
import moment from 'moment';
import { useWithdrawalRequestPageContext } from '../../pages/WithdrawalRequestPage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Firebase from '../helpers/Firebase';
import { WITHDRAWAL_STATUS } from '../../constants/common';

const theme = createTheme({
    components: {
        MUIDataTableBodyRow: {
            styleOverrides: {
                root: {
                    "&.MuiTableRow-hover": {
                        "&:hover": {
                            cursor: 'pointer'
                        }
                    }
                }
            }
        },
    }
})

const ApprovedWithdrawalRequestComponent = () => {
    const { queryResult } = useWithdrawalRequestPageContext();
    const withdraws = queryResult.data.data.approvedWithdraws;
    console.log(withdraws);
    const [data, setData] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openDeleteModal, setDeleteModal] = useState(false);
    const [rowData, setRowData] = useState([]);
    useEffect(() => {
        var temp = [];
        withdraws && withdraws.map((item) => {
            const timestamp = Firebase.firestore.Timestamp.fromMillis(
                item.withdrawal_timestampSent._seconds * 1000 + item.withdrawal_timestampSent._nanoseconds / 1000000
            );
            const withdrawal_timestampSent = timestamp.toDate();
            const userDetails =
                item.userDetails && item.userDetails.firstname && item.userDetails.lastname
                    ? item.userDetails.firstname + ' ' + item.userDetails.lastname
                    : '';

            temp.push([
                userDetails,
                item.withdrawal_gcashnum,
                " \u20B1" + item.withdrawal_amount,
                item.type,
                WITHDRAWAL_STATUS[item.withdrawal_status - 1],
                item.withdrawal_timestampSent && moment(withdrawal_timestampSent).format("MMMM DD, YYYY"),
            ]);
        })
        setData(temp);
    }, [withdraws])

    const handleOpenViewModal = (rowData) => {
        setOpenViewModal(true);
        setRowData(rowData);
    }
    const handleDeleteModal = (e, rowData) => {
        e.stopPropagation();
        setDeleteModal(true)
        setRowData(rowData);
    }

    const columns = [
        {
            name: "Name",
            label: "Name",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "Gcash Number",
            label: "Gcash Number",
            options: {
                filter: false,
                sort: false
            }
        },
        {
            name: "Amount",
            label: "Amount",
            options: {
                filter: false,
                sort: false
            }
        },
        {
            name: "Type",
            label: "Type",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "Status",
            label: "Status",
            options: {
                filter: true,
                sort: true
            }
        },



        {
            name: "Date Sent",
            label: "Date Sent",
            options: {
                filter: true,
                sort: true
            }
        },

    ];


    const options = {
        selectableRowsHeader: false,
        selectableRows: 'none',
        filter: true,
        filterType: 'dropdown'
    };



    return (
        <div>
            <ThemeProvider theme={theme}>
                <MUIDataTable
                    title={"Approved List"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </ThemeProvider>
        </div>
    )
}




export default ApprovedWithdrawalRequestComponent