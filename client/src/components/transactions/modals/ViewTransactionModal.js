import React from "react";
import { styled } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Avatar } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose && onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : (<></>)}
    </DialogTitle>
  );
};

export default function ViewTransactionModal(props) {
  return (
    <BootstrapDialog
      fullWidth={true}
      onClose={props.handleCloseModal}
      aria-labelledby="customized-dialog-title"
      open={props.openModal}
    >
      <BootstrapDialogTitle
        onClose={props.handleCloseModal}
      >
        {props.title}
      </BootstrapDialogTitle>
      <DialogContent dividers >
        <div className="container text-center m-auto align-content-center align-middle">
          {props.data[9] !== null || <Avatar sx={{ width: 100, height: 100, fontSize: 50, margin: "auto" }}>{props.data[0][0] + "" + props.data[1][0]}</Avatar>}
          {props.data[9] && <Avatar src={props.data[9]} sx={{ width: 100, height: 100, margin: "auto" }} />}
        </div>

        <div className="container text-center mt-3">
          <div className="row">
            <div className="col text-end">
              <span className="text-black text-uppercase small">Transaction Number: </span>
            </div>
            <div className="col text-start">
              <span className="text-black fs-6 fw-bold">{props.data[0] !== "" || props.data[0] !== null ? props.data[0] : "NONE"}</span>
            </div>
          </div>
          <div className="row">
            <div className="col text-end">
              <span className="text-black text-uppercase small">Customer: </span>
            </div>
            <div className="col text-start">
              <span className="text-black fs-6 fw-bold">{props.data[1] !== "" || props.data[1] !== 'null' ? props.data[1] : "NONE"}</span>
            </div>
          </div>
          <div className="row">
            <div className="col text-end">
              <span className="text-black text-uppercase small">Itinerant: </span>
            </div>
            <div className="col text-start">
              <span className="text-black fs-6 fw-bold">{props.data[2] !== "" || props.data[2] !== 'null' ? props.data[2] : "NONE"}</span>
            </div>
          </div>
          <div className="row">
            <div className="col text-end">
              <span className="text-black text-uppercase small">Total Amount: </span>
            </div>
            <div className="col text-start">
              <span className="text-black fs-6 fw-bold">{props.data[3] !== "" || props.data[3] !== 'null' ? props.data[3] : "NONE"}</span>
            </div>
          </div>
          <div className="row">
            <div className="col text-end">
              <span className="text-black text-uppercase small">Request Address: </span>
            </div>
            <div className="col text-start">
              <span className="text-black fs-6 fw-bold">{props.data[5] !== "" || props.data[5] !== 'null' ? props.data[5] : "NONE"}</span>
            </div>
          </div>
          <div className="row">
            <div className="col text-end">
              <span className="text-black text-uppercase small">Status: </span>
            </div>
            <div className="col text-start">
              <span className="text-black fs-6 fw-bold">{props.data[6] !== "" || props.data[6] !== null ? props.data[6] : "NONE"}</span>
            </div>
          </div>
          <div className="row">
            <div className="col text-end">
              <span className="text-black text-uppercase small">Details: </span>
            </div>
            <div className="col text-start">
              {props.data[4] && props.data[4].length
                > 0 ? (
                props.data[4].map((item, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <p className="col text-start" style={{ marginBottom: '5px' }}>{'Product Name: ' + item.item}</p>
                    <div className="row">
                      <div className="col">
                        <p style={{ marginBottom: '5px' }}>{'Price: '}</p>
                        <p>{"\u20B1" + item.price}</p>
                      </div>
                      <div className="col">
                        <p style={{ marginBottom: '5px' }}>{'Quantity: '}</p>
                        <p>{item.qty}</p>
                      </div>
                    </div>
                  </div>

                ))
              ) : (
                <span className="text-black fs-6 fw-bold">NONE</span>
              )}
            </div>
          </div>


        </div>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.handleCloseModal}>
          Close
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
