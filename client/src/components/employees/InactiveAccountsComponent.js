import React, { useEffect, useState } from 'react'
import MUIDataTable from "mui-datatables";
import moment from 'moment';
import { useEmployeePageContext } from '../../pages/EmployeesPage';
import { ButtonGroup } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ViewEmployeeModal from '../common/modals/ViewEmployeeModal';
import ReactivateModal from '../common/modals/ReactivateModal';
import { GENDERTYPE } from '../../constants/common';
import Firebase from '../helpers/Firebase';

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

const InactiveAccountsComponent = () => {
    const { queryResult } = useEmployeePageContext();
    const inactives = queryResult.data.data.inactives;
    const [data, setData] = useState([]);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openDeleteModal, setDeleteModal] = useState(false);
    const [rowData, setRowData] = useState([]);

    const handleOpenViewModal = (rowData) => {
        setOpenViewModal(true);
        console.log(rowData);
        setRowData(rowData);
    }
    const handleDeleteModal = (e, rowData) => {
        e.stopPropagation();
        setDeleteModal(true)
        setRowData(rowData);
    }
    useEffect(() => {
        var temp = [];
        inactives && inactives.map((item) => {
            const timestamp = Firebase.firestore.Timestamp.fromMillis(
                item.createdAt._seconds * 1000 + item.createdAt._nanoseconds / 1000000
              );
            const createdAt = timestamp.toDate();
            temp.push([item.firstname && item.firstname,
            item.lastname && item.lastname,
            item.email && item.email,
            item.contact_no && item.contact_no,
            item.address && item.address,
            item.birthday && moment().diff(moment.unix(item.birthday._seconds), 'years'),
            item.gender && item.gender === 1 ? GENDERTYPE[0] : GENDERTYPE[1],
            item.createdAt && moment(createdAt).format("MMMM DD, YYYY"),
            item.status && item.status === true ? 'Active' : 'Inactive',
            item.admin_id && item.admin_id ? 'Admin' : 'Itinerant']
            );
        })
        setData(temp);
    }, [inactives])
    const columns = [
        {
            name: "Last Name",
            label: "last Name",
            options: {
                filter: false,
                sort: false,
                display: false,
                viewColumns: false,
            }
        },
        {
            name: "First Name",
            label: "First Name",
            options: {
                filter: false,
                sort: false,
                display: false,
                viewColumns: false,
            }
        },
        {
            name: "Email",
            label: "Email",
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "Contact Number",
            label: "Contact Number",
            options: {
                filter: false,
                sort: false,
                display: false,
                viewColumns: false,
            }
        },
        {
            name: "Address",
            label: "Address",
            options: {
                filter: false,
                sort: false,
                display: false,
                viewColumns: false,
            }
        },
        {
            name: "Age",
            label: "Age",
            options: {
                filter: false,
                sort: false,
                display: false,
                viewColumns: false,
            }
        },
        {
            name: "Gender",
            label: "Gender",
            options: {
                filter: false,
                sort: false,
                display: false,
                viewColumns: false,
            }
        },
        {
            name: "Date Added",
            label: "Date Added",
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
                sort: false,
                display: false,
                viewColumns: false,
            }
        },
        {
            name: "Type",
            label: "Type",
            options: {
                filter: true,
                sort: false
            }
        },
        {
            name: "Image",
            label: "Image",
            options: {
                filter: false,
                sort: false,
                display: false,
                viewColumns: false,
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
                            <button onClick={() => handleOpenViewModal(tableMeta.rowData)} className="btn btn-primary mx-1"><i className="fa fa-info-circle" aria-hidden="true"></i></button>
                            <button onClick={(e) => handleDeleteModal(e, tableMeta.rowData)} className={(tableMeta.rowData[8] === "Active") ? "btn btn-danger" : "btn btn-success"}><i className={(tableMeta.rowData[8] === "Active") ? "fa fa-eye-slash" : "fa fa-check"} aria-hidden="true"></i></button>
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
            <ViewEmployeeModal data={rowData} title=" View Employee Details" openModal={openViewModal} setOpenModal={setOpenViewModal} handleCloseModal={() => setOpenViewModal(false)} />
            <ReactivateModal data={rowData} title="Are you sure you want to Reactivate this Employee Record?" module={"employees"} openDeleteModal={openDeleteModal} setDeleteModal={setDeleteModal} />
            <ThemeProvider theme={theme}>
                <MUIDataTable
                    title={"Inactive Account List"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </ThemeProvider>
        </div>
    )
}

export default InactiveAccountsComponent
