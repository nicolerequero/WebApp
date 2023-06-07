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
import Firebase from '../../helpers/Firebase';
import { Avatar } from "@mui/material";

const storage = Firebase.storage();

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

export default function ViewUserVerificationModal(props) {
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

                <div className="container text-center mt-3">
                    <div className="row">
                        <div className="col text-end">
                            <span className="text-black text-uppercase small">Image: </span>
                        </div>
                        <div className="col text-start">
                            {props.data[5] !== "" && props.data[5] !== null ?
                                <img src={props.data[5]} 
                                style={{height: 200, margin:"auto",alignSelf:"center",alignContent:"center",justifyContent:"center"}}
                                alt="Image" /> :
                                <span className="text-black fs-6 fw-bold">NONE</span>
                            }
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
