import React, { useEffect, useState } from 'react'
import Grid from "@mui/material/Grid";
import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import { useFormik } from 'formik';
import axios from "axios";
import * as yup from 'yup'
import { capitalizeWords } from '../../helpers/TextFormat';
import { useEmployeePageContext } from '../../../pages/EmployeesPage';
import { useSnackbar } from 'notistack'
import { CircularProgress } from '@mui/material';
import Firebase from '../../../components/helpers/Firebase';

const auth = Firebase.auth();
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '500px',
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
const isAtLeast18YearsAgo = (date) => {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return date <= minDate;
};

export default function AddNewEmployeeModal(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { refetch } = useEmployeePageContext();
  const [loading, setLoading] = React.useState(false);
  const digitsOnly = (value) => /^\d+$/.test(value)
  const employeeRegisterValidationSchema = yup.object().shape({
    firstname: yup
      .string()
      .required('First Name is required'),
    lastname: yup
      .string()
      .required('Last Name is required'),
    email: yup
      .string()
      .email("Please enter valid email")
      .required('Email is required'),
    address: yup
      .string()
      .required('Address is required'),
    gender: yup
      .string()
      .required('Gender is required'),
    birthday: yup
      .date()
      .test('is-at-least-18-years-ago', 'You must be at least 18 years old', (value) => isAtLeast18YearsAgo(value))
      .required('Birthday is required'),
    contact_no: yup
      .string()
      .required('Contact Number is required')
      .test('Digits only', 'The field should be digits only', digitsOnly)
      .min(11, `Must be 11 digits starting with 09`)
      .max(11, `Must be 11 digits starting with 09`),
  })

  const handleFirebase = async (values, resetForm) => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(values.email, "p@ssw0rd");
      const uid = userCredential.user.uid;
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/employees/add`, {
        email: values.email,
        contact_no: values.contact_no,
        firstname: capitalizeWords(values.firstname),
        lastname: capitalizeWords(values.lastname),
        address: capitalizeWords(values.address),
        birthday: values.birthday,
        gender: values.gender,
        uid: uid
      })
        .then(res => {
          setLoading(false);
          if (res.data.success) {
       
           
            refetch();
            enqueueSnackbar(res.data.message, { variant: 'success' });
          } else {
            enqueueSnackbar(res.data.message, { variant: 'error' });
          }
        })
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    setLoading(true);
    handleFirebase(values,resetForm);
 
  }
  const { handleChange, handleSubmit, handleBlur, values, errors, isValid, touched, setErrors } = useFormik({
    initialValues: { firstname: '', lastname: '', email: '', contact_no: '', address: '', birthday: '', gender: '' },
    enableReinitialize: true,
    initialErrors: false,
    validationSchema: employeeRegisterValidationSchema,
    onSubmit: handleFormSubmit
  });

  useEffect(() => {
    setErrors({});
  }, [!props.openModal])

  return (
    <BootstrapDialog
      onClose={() => props.setOpenModal(false)}
      aria-labelledby="customized-dialog-title"
      open={props.openModal}
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={() => props.setOpenModal(false)}>
        Add Admin Record
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Box sx={{ width: '100%' }}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              <TextField
                value={values.firstname}
                onChange={handleChange('firstname')}
                onBlur={handleBlur('firstname')}
                margin="dense"
                label="First Name"
                type="text"
                inputProps={{ style: { textTransform: "capitalize" } }}
                fullWidth
              />
              {(errors.firstname && touched.firstname) &&
                <p className="text-danger small ">{errors.firstname}</p>
              }
            </Grid>
            <Grid item xs={6}>
              <TextField
                value={values.lastname}
                onChange={handleChange('lastname')}
                onBlur={handleBlur('lastname')}
                inputProps={{ style: { textTransform: "capitalize" } }}
                margin="dense"
                label="Last Name"
                type="text"
                fullWidth
              />
              {(errors.lastname && touched.lastname) &&
                <p className="text-danger small ">{errors.lastname}</p>
              }
            </Grid>
          </Grid>

          <TextField
            value={values.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            inputProps={{ style: { textTransform: "lowercase" } }}
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
          />
          {(errors.email && touched.email) &&
            <p className="text-danger small ">{errors.email}</p>
          }
          <TextField
            value={values.address}
            onChange={handleChange('address')}
            onBlur={handleBlur('address')}
            margin="dense"
            label="Address"
            type="text"
            fullWidth
          />
          {(errors.address && touched.address) &&
            <p className="text-danger small ">{errors.address}</p>
          }

          <TextField
            value={values.contact_no}
            onChange={handleChange('contact_no')}
            onBlur={handleBlur('contact_no')}
            margin="dense"
            label="Contact Number"
            type="text"
            fullWidth
          />
          {(errors.contact_no && touched.contact_no) &&
            <p className="text-danger small ">{errors.contact_no}</p>
          }

          <TextField
            value={values.birthday}
            onChange={handleChange('birthday')}
            onBlur={handleBlur('birthday')}
            margin="dense"
            type="date"
            fullWidth
            label="Birthday"
            InputLabelProps={{
              shrink: true,
              }}
          />
          {(errors.birthday && touched.birthday) &&
            <p className="text-danger small ">{errors.birthday}</p>
          }

          <Grid container rowSpacing={1} mt={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={6}>
              <FormControl sx={{ width: '100%' }}>
                <InputLabel htmlFor="gender">Gender</InputLabel>
                <Select
                  value={values.gender}
                  onChange={handleChange('gender')}
                  onBlur={handleBlur('gender')}
                  label="Gender"
                  inputProps={{
                    name: 'gender',
                    id: 'gender',
                  }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
              {(errors.gender && touched.gender) &&
                <p className="text-danger small">{errors.gender}</p>
              }
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <button type="submit" className='btn btn-success' disabled={!isValid || loading} onClick={handleSubmit}>
          {loading ? <><CircularProgress size={20} /> Adding...</> : "Add Employee"}
        </button>
      </DialogActions>
    </BootstrapDialog>
  );
}