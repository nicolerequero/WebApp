import React, { useState } from "react";
import { TextField, Grid, Stack, Box } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";
import * as yup from 'yup';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import { CircularProgress } from '@mui/material';
import { GENDERTYPE } from '../../../constants/common';
import Firebase from '../../helpers/Firebase';
import moment from 'moment';




const Info = (props) => {
  console.log(props);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const digitsOnly = (value) => /^\d+$/.test(value)
  const profileInfoValidationSchema = yup.object().shape({
    gender: yup
      .string()
      .required('Gender is required'),
    contact_no: yup
      .string()
      .required('Contact Number is required')
      .test('Digits only', 'The field should be digits only', digitsOnly)
      .min(11, `Must be 11 digits starting with 09`)
      .max(11, `Must be 11 digits starting with 09`)
  })

  const handleFormSubmit = () => {
    setLoading(true);
    if (Cookies.get('admin_id')) {
      Axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/profile/info`, {
        gender: values.gender,
        contact_no: values.contact_no,
        accessToken: Cookies.get('admin_id')
      }).then(res => {
        setLoading(false);
        if (res.data.success) {
          props.setUser(res.data.data.acc);
          Cookies.set('admin_id', res.data.data.accessToken, { expires: 1 });
          enqueueSnackbar(res.data.message, { variant: 'success' });
        } else {
          enqueueSnackbar(res.data.message, { variant: 'error' });
        }
      })
    } else {
      navigate("/login");
    }
  }
  const birthdayTimestamp = Firebase.firestore.Timestamp.fromMillis(
    props.user.birthday._seconds * 1000 + props.user.birthday._nanoseconds / 1000000
  );
  const birthdayDate = birthdayTimestamp.toDate();

  const { handleChange, handleSubmit, handleBlur, values, errors, isValid, touched } = useFormik({
    initialValues: {
      gender: props.user && props.user.gender === 1 ? GENDERTYPE[0] : GENDERTYPE[1],
      contact_no: props.user && props.user.contact_no ? props.user.contact_no : '',
      birthday: props.user && moment(birthdayDate).format("YYYY-DD-MM")
    },
    enableReinitialize: true,
    validationSchema: profileInfoValidationSchema,
    onSubmit: handleFormSubmit
  });
  return (
    <Box
      component="form"
      sx={{
        margin: 'auto',
        width: '100vh',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Stack sx={{ marginTop: 2 }} spacing={2}>
        <Grid container rowSpacing={1} mt={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <TextField
              value={values.contact_no}
              onChange={handleChange('contact_no')}
              onBlur={handleBlur('contact_no')}
              id="outlined-basic"
              label="Contact Number"
              variant="outlined"
              fullWidth />
            {(errors.contact_no && touched.contact_no) &&
              <p className="text-danger small">{errors.contact_no}</p>
            }
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={values.birthday}
              onChange={handleChange('birthday')}
              onBlur={handleBlur('birthday')}
              id="birthday"
              label="Birthday"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ readOnly: true }}
            />

          </Grid>
        </Grid>


      </Stack>
      <button className='btn btn-success mt-2' type="submit" disabled={!isValid || loading} onClick={handleSubmit}>
        {loading ? <><CircularProgress size={20} /> Saving...</> : "Save"}
      </button>
    </Box>
  );
}

export default Info;