import React, { useEffect, useState } from 'react'
import MUIDataTable from "mui-datatables";
import moment from 'moment';
import { useWithdrawalRequestPageContext } from '../../pages/WithdrawalRequestPage';
import { ButtonGroup } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DeleteEmployeeModal from '../common/modals/DeleteEmployeeModal';
import ReactivateModal from '../common/modals/ReactivateModal';
import ApproveModal from '../withdrawalRequests/modals/ApproveModal';
import DiscardModal from '../withdrawalRequests/modals/DiscardModal';

// import ViewWithdrawalRequestModal from './modals/ViewWithdrawalRequestModal';
// import VerifyCustomerModal from './modals/VerifyCustomerModal';
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

const WithdrawalRequestComponent = () => {
    const { queryResult } = useWithdrawalRequestPageContext();
    const withdraws = queryResult.data.data.withdraws;
    const [data, setData] = useState([]);
    const [openApproveModal, setApproveModal] = useState(false);
    const [openDiscardModal, setDiscardModal] = useState(false);
    const [rowData, setRowData] = useState([]);
    useEffect(() => {
        var temp = [];
        withdraws && withdraws.map((item) => {
            const timestamp = Firebase.firestore.Timestamp.fromMillis(
                item.withdrawal_timestampSent._seconds * 1000 + item.withdrawal_timestampSent._nanoseconds / 1000000
            );
            const withdrawal_timestampSent = timestamp.toDate();
            temp.push([
                item.withdrawal_request_id,
                item.userDetails.firstname + ' ' + item.userDetails.lastname && item.userDetails.firstname + ' ' + item.userDetails.lastname,
                " \u20B1" + item.balance,
                item.withdrawal_gcashnum,
                " \u20B1" + item.withdrawal_amount,
                item.type,
                WITHDRAWAL_STATUS[item.withdrawal_status - 1],
                item.withdrawal_timestampSent && moment(withdrawal_timestampSent).format("MMMM DD, YYYY"),
                item.withdrawal_userid ? item.withdrawal_userid : item.withdrawal_itinid
            ]);
        })
        setData(temp);
    }, [withdraws])

    const handleApproveModal = (e, rowData) => {
        e.stopPropagation();
        setApproveModal(true)
        setRowData(rowData);
    }

    const handleDiscardModal = (e, rowData) => {
        e.stopPropagation();
        setDiscardModal(true)
        setRowData(rowData);
    }

    const columns = [
        {
            name: "ID",
            label: "ID",
            options: {
                filter: false,
                sort: false,
                display: false,
                viewColumns: false,
            }
        },
        {
            name: "Name",
            label: "Name",
            options: {
                filter: true,
                sort: true
            }
        },
        {
            name: "Current Wallet Balance",
            label: "Current Wallet Balance",
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
        {
            name: "Actions",
            label: "Actions",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <ButtonGroup>
                            <button onClick={(e) => handleApproveModal(e, tableMeta.rowData)} className="btn btn-success mx-1"><i className="fa fa-check" aria-hidden="true"></i></button>
                            <button onClick={(e) => handleDiscardModal(e, tableMeta.rowData)} className="btn btn-danger"><i className="fa fa-trash" aria-hidden="true"></i></button>

                        </ButtonGroup>
                    )
                }
            }
        }
    ];


    const options = {
        selectableRowsHeader: false,
        selectableRows: 'none',
        filter: true,
        filterType: 'dropdown'
    };



    return (
        <div>
            <ApproveModal data={rowData} title="Are you sure you want to approve this withdrawal request?"  openApproveModal={openApproveModal} setApproveModal={setApproveModal} />
            <DiscardModal data={rowData} title="Are you sure you want to discard this withdrawal request?"  openDiscardModal={openDiscardModal} setDiscardModal={setDiscardModal} />

            <ThemeProvider theme={theme}>
                <MUIDataTable
                    title={"Pending List"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </ThemeProvider>
        </div>
    )
}




export default WithdrawalRequestComponent