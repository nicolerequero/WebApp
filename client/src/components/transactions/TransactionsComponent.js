import React, { useEffect, useState } from 'react'
import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTransactionPageContext } from '../../pages/TransactionsPage';
import moment from 'moment';
import ViewTransactionModal from '../transactions/modals/ViewTransactionModal';
import { ButtonGroup } from '@mui/material';
import { REQUEST_STATUS } from '../../constants/common';

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
const TransactionsComponent = () => {
  const [data, setData] = useState([]);
  const { queryResult } = useTransactionPageContext();
  const [openViewModal, setOpenViewModal] = useState(false);
  const [rowData, setRowData] = useState([]);
  const transactions = queryResult.data;
  console.log(transactions)
  useEffect(() => {
    var temp = [];
    transactions && transactions.map((item) => {
      let totalAmount = 0;
      item.details && item.details.map((detail) => {
        const price = detail.price * detail.qty;
        totalAmount += price;
        temp.push([item.requestId && item.requestId,
          item.custFname+' '+ item.custLname &&  item.custFname+' '+ item.custLname,
          item.itinFname+' '+ item.itinLname &&  item.itinFname+' '+ item.itinLname,
          totalAmount && " \u20B1" +  totalAmount,
          item.details && item.details,
          item.reqDAddress && item.reqDAddress,
          item.status && REQUEST_STATUS[item.status - 1],
          item.reqDDate && moment(item.reqDDate.time).format("MMMM DD, YYYY, h:mm A")
          ]);
      });
    })
    setData(temp);
  }, [transactions])
 

  const handleOpenViewModal = (rowData) => {
    setOpenViewModal(true);
    setRowData(rowData);
  }

  const columns = [
    {
      name: "ID",
      label: "ID",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
        name:"Customer",
        label:"Customer",
        options: {
          filter: false,
          sort: false,
          display: false,
          viewColumns: false,
        }
    },
    {
      name:"Itinerant",
      label:"Itinerant",
      options: {
        filter: false,
        sort: false,
        display: false,
        viewColumns: false,
      }
  },
    {
      name: "Amount",
      label: "Amount",
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: "Details",
      label: "Details",
      options: {
        filter: false,
        sort: false,
        display: false,
        viewColumns: false,
      }
    },
    {
      name: "Dropoff Address",
      label: "Dropoff Address",
      options: {
        filter: false,
        sort: false,
        display: false,
        viewColumns: false,
      }
    },
    {
      name: "Status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
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
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <ButtonGroup>
              <button onClick={() => handleOpenViewModal(tableMeta.rowData)} className="btn btn-primary mx-1"><i className="fa fa-info-circle" aria-hidden="true"></i></button>
            </ButtonGroup>
          )
        }
      }
    }
  ]
  const options = {
    selectableRowsHeader: false,
    selectableRows: 'none',
    filter: true,
    filterType: 'dropdown'
  };
  console.log(rowData);
  return (
    <div>
      <ViewTransactionModal data={rowData} title=" View Transaction Details" openModal={openViewModal} setOpenModal={setOpenViewModal} handleCloseModal={() => setOpenViewModal(false)} />
      <ThemeProvider theme={theme}>
        <MUIDataTable
          title={"Transactions List"}
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </div>


  )
}

export default TransactionsComponent