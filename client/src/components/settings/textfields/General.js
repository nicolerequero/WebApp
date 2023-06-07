import React, { useEffect, useState } from "react";
import { TextField,Stack,Box} from "@mui/material";
import * as yup from 'yup'
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import { useFormik } from 'formik';
import UploadProfile from "../../helpers/UploadProfile";
import { capitalizeWords } from "../../helpers/TextFormat";
import { useSnackbar } from 'notistack';
import { CircularProgress } from '@mui/material';
const General = (props) => {
    const { enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [url,setUrl] = useState(null);
    const [user,setUser] = useState({
        firstname:"",
        lastname:""
    });
    const [progress, setProgress] = useState(0);
 
    useEffect(() => {
        setUser({
          firstname:props.user&&props.user.firstname?props.user.firstname:'',
          lastname:props.user&&props.user.lastname?props.user.lastname:'',
        });
        setUrl(props.user&&props.user.image?props.user.image:'');
    }, [props.user])
    
    const profileGeneralValidationSchema = yup.object().shape({
        firstname: yup
            .string()
            .required('First Name is required'),
        lastname: yup
            .string()
            .required('Last Name is required')
    })
    const accessToken = Cookies.get('admin_id');
    // console.log('ADMIN ID:', accessToken)
    const handleFormSubmit = () => {
      setLoading(true);
      if (accessToken) {
        Axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/profile/general_info`,{
          firstname: capitalizeWords(values.firstname),
          lastname: capitalizeWords(values.lastname),
          accessToken: accessToken
        }).then(res=>{
          setLoading(false);
          if (res.data.success) {
            props.setUser(res.data.data.updatedAdmin);
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
   
    const { handleChange, handleSubmit, handleBlur, values, errors,isValid,touched } = useFormik({
        initialValues: {
            firstname:props.user&&props.user.firstname?props.user.firstname:'',
            lastname:props.user&&props.user.lastname?props.user.lastname:'',
            email:props.user&&props.user.email?props.user.email:'',
            image:props.user&&props.user.image?props.user.image:'',
            address:props.user&&props.user.address?props.user.address:''
        },
        enableReinitialize:true,
        validationSchema:profileGeneralValidationSchema,
        onSubmit: handleFormSubmit
    });
   
    return(
            <Box
            component="form"
            sx={{
            margin:'auto',
            width:'100vh',
            height: '100%',
            justifyContent:'center',
            alignItems:'center'
            }}
        > 
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <UploadProfile values = {values} user={user} progress = {progress} setProgress = {setProgress} url = {url} setUrl={setUrl}/>
            </Stack>
            <Stack sx={{marginTop:2}} spacing={2}>
           
                 <TextField
                    value= {values.firstname}
                    onChange={handleChange('firstname')}
                    onBlur={handleBlur('firstname')}
                    inputProps={{ style: { textTransform: "capitalize"} }}
                    id="firstname"
                    label="First Name"
                    type="text"
                    fullWidth
                />
                 {(errors.firstname && touched.firstname) &&
                <p className="text-danger small ">{errors.firstname}</p>
                } 
                  <TextField
                    value={values.lastname}
                    onChange={handleChange('lastname')}
                    onBlur={handleBlur('lastname')}
                    inputProps={{ style: { textTransform: "capitalize" } }}
                    id="lastname"
                    label="Last Name"
                    type="text"
                    fullWidth
                />
                 {(errors.lastname && touched.lastname) &&
                <p className="text-danger small ">{errors.lastname}</p>
                } 
                <TextField
                    id="outlined-read-only-input"
                    label="Email"
                    value={values.email}
                    inputProps={{ readOnly: true, style: { textTransform: "lowercase" } }}
                    fullWidth
                />
                
                <TextField
                    id="outlined-read-only-input"
                    label="Address"
                    value={values.address}
                    InputProps={{
                        readOnly: true,
                    }}
                    fullWidth
                />
            </Stack>
            <button className='btn btn-success mt-2' type="submit" disabled={!isValid||loading} onClick={handleSubmit}>
            {loading?<><CircularProgress size={20}/> Saving...</>:"Save"}
          </button>
        </Box>
       
    );
}

export default General;