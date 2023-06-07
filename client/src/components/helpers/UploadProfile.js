import React from 'react';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import Firebase from './Firebase';
import { uuidGenerator } from './uuidGenerator';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'notistack';
import Cookies from "js-cookie";
import Axios from 'axios';
const storage = Firebase.storage();
const UploadProfile = ({values,url,setUrl,progress,setProgress,user}) => {
  const { enqueueSnackbar} = useSnackbar();
    function LinearProgressWithLabel(props) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">{`${Math.round(
                props.value,
              )}%`}</Typography>
            </Box>
          </Box>
        );
    }
    LinearProgressWithLabel.propTypes = {
        /**
         * The value of the progress indicator for the determinate and buffer variants.
         * Value between 0 and 100.
         */
        value: PropTypes.number.isRequired,
      };
    const handleChange = (event) =>{
        handleUpload(event.target.files[0]);
    }
  
    const handleUpload = (file) => {
      let image = file;
      // images.forEach(function(image){
        let filename = uuidGenerator();
        const uploadTask = storage.ref(`/Images/Profile Pictures/${filename}`).put(image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setProgress(progress);
          },
          (err) => {
              console.log(err);
          },
          async () => {
            await storage
            .ref("/Images/Profile Pictures/")
            .child(filename)
            .getDownloadURL()
            .then((url)=>{
              setUrl(url);
              Axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/profile/change_profile_photo`,{
                image:url,
                accessToken: Cookies.get('admin_id')
              }).then( res => {
                if(res.data.success){
                  console.log(res.data);
                  setUrl(res.data.data.updatedAdmin.image);
                  Cookies.set('admin_id',res.data.data.accessToken, {expires: 1});
                  enqueueSnackbar(res.data.message, { variant:'success' });
                  setProgress(0);
                  // window.location.reload();
                }else{
                  enqueueSnackbar(res.data.message, { variant:'error' });
                }
              });
           
            })
          }
        )
  }

    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <LinearProgressWithLabel value={progress} />
            </Box>
            
            <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ height: '100px', width: '100px' }} src={`${url?url:values.image}`}>{`${user.firstname[0]+user.lastname[0]}`}</Avatar>
            <Button
                  variant="contained"
                  component="label"
                >
                  Choose Image
                  <Input
                    type="file"
                    hidden
                    inputProps={{accept:'image/jpeg,image/jpg,image/png' }}
                    onChange ={handleChange}
                  />
                </Button>
            </Stack>

           
           
          </div>
        );


}
export default UploadProfile