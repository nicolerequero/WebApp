import React, {useEffect, useState} from "react";
import { TextField,Box} from "@mui/material";
import * as yup from 'yup'
import Axios from 'axios';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Grid from "@mui/material/Grid";
import { useSnackbar } from 'notistack';
import Firebase from '../../helpers/Firebase';
import { CircularProgress } from '@mui/material';
import { decodeToken } from "react-jwt";
import "firebase/auth"

const auth = Firebase.auth();
const ChangePassword = (props) => {
  const { enqueueSnackbar} = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const profilePasswordValidationSchema = yup.object().shape({
        password: yup
            .string()
            .required('Password is required'),
        newPassword: yup
            .string()
            .min(8, ({ min }) => `Password must be at least ${min} characters`)
            .required('New Password is required'),
        confirmPassword: yup
            .string()
            .oneOf([yup
                .ref('newPassword')
                ],'Password must match!')
            .required('New Password is required'),
    })
    const getCookiesJWT=()=>{
      const cookie=Cookies.get("admin_id");
      if(cookie){
          const decodedToken = decodeToken(cookie);
          setUser(JSON.parse(decodedToken.admin_id));
      }
  }
  useEffect(() => {
    if(Cookies.get('admin_id')){
      getCookiesJWT()
    }else{
      navigate("/login");
    }
  }, [navigate])
  
    const handleFirebase =async (values,resetForm,data) =>{
        await auth.currentUser.updatePassword(values.newPassword);
        resetForm();
        setLoading(false);
        enqueueSnackbar(data.message, { variant:'success' });
    }

    const handleFormSubmit = async(values, {resetForm}) => {
      setLoading(true);
        if(Cookies.get('admin_id')){
          var credential=await Firebase.auth.EmailAuthProvider.credential(user.email, values.password);
          await auth.currentUser.reauthenticateWithCredential(credential)
          Axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/profile/change_password`,{
            password:values.password,
            newPassword: values.newPassword,
            confirmPassword:values.confirmPassword,
            accessToken: Cookies.get('admin_id')
          }).then(res=>{
            if(res.data.success){
              handleFirebase(values, resetForm, res.data);
            }else{
              setLoading(false);
              enqueueSnackbar(res.data.message, { variant:'error' });
            }
          })
        }else{
          navigate("/login");
        }
      }

    const { handleChange, handleSubmit, handleBlur, values, errors,isValid,touched } = useFormik({
        initialValues:{ password:'',newPassword:'',confirmPassword:''},
        enableReinitialize:true,
        validationSchema:profilePasswordValidationSchema,
        onSubmit: handleFormSubmit
      });
    return(
        <Box sx={{ width: '100%' }}>
             <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={12}>
                <TextField
                    value={values.password}
                    onChange={handleChange('password')}
                    onBlur={handleBlur('password')}
                    id="password"
                    label="Current Password"
                    type="password"
                    fullWidth
                    
                />
                {(errors.password && touched.password) &&
                <p className="text-danger small ">{errors.password}</p>
                } 
                </Grid>
                <Grid item xs={12}>
                <TextField
                    value={values.newPassword}
                    onChange={handleChange('newPassword')}
                    onBlur={handleBlur('newPassword')}
                    id="newPassword"
                    label="New Password"
                    type="password"
                    fullWidth
                />
                {(errors.newPassword && touched.newPassword) &&
                <p className="text-danger small ">{errors.newPassword}</p>
                }
                </Grid>
                <Grid item xs={12}>
                <TextField
                    value={values.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    id="confirmPassword"
                    label="Repeat New Password"
                    type="password"
                    fullWidth
                />
                {(errors.confirmPassword && touched.confirmPassword) &&
                <p className="text-danger small ">{errors.confirmPassword}</p>
                }
                </Grid>
            </Grid>
            <button className='btn btn-success mt-2' type="submit"  disabled={!isValid||loading} onClick={handleSubmit}>
              {loading?<><CircularProgress size={20}/> Saving...</>:"Save"}
            </button>
        </Box>
    );
}

export default ChangePassword;