import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import AdminLoginValidation from '../validations/AdminLoginValidation';
import Axios from "axios";
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Cookies from 'js-cookie';
import Firebase from '../components/helpers/Firebase';

const auth = Firebase.auth();
function Copyright(props) {
    return (
        <Typography variant="body2" color="text.dark" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Pasabili
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();
const LoginPage = () => {
    const [open, setOpen] = useState(false);
    const { register, handleSubmit } = useForm();
    const [admin, setAdmin] = useState({
        email: "",
        password: ""
    });
    const handleChange = (event) => {
        setAdmin({ ...admin, [event.target.name]: event.target.value });
    }
    const [errors, setErrors] = useState({})

    const [loading, setLoading] = useState(false);


    const [alert, setAlert] = useState({
        visibility: false,
        message: null,
        severity: null,
    });
    const navigate = useNavigate();
    useEffect(() => {
        if (Cookies.get('admin_id')) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleFirebase = async (accessToken) => {
        await auth.signInWithEmailAndPassword(admin.email, admin.password)
            .then(function () {
                setLoading(false);
                Cookies.set('admin_id', accessToken, { expires: 1 });
               
                navigate("/dashboard");
            })
            .catch(function (err) {
                setLoading(false);
            });
    }
    const handleFormSubmit = (event) => {
        event.preventDefault();
        setErrors(AdminLoginValidation(admin));
        if (Object.keys(AdminLoginValidation(admin)).length === 0) {
            Axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin/login`, {
                email: admin.email,
                password: admin.password
            }).then((res) => {
                if (res.data.success) {
                    handleFirebase(res.data.data);
                } else {
                    setLoading(false);
                    setAlert({ visibility: true, message: res.data.message, severity: "error" });
                }
            })
        } else {
            setLoading(false);
        }


    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <div>
                    {alert.visibility ? <Alert sx={{ mt: 1 }} severity={alert.severity} >{alert.message}</Alert> : <></>}
                </div>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Link color="inherit" href="/">
                        <img alt="Pasabili Logo" width={150} className='mb-4' src='/images/img_logo.png'></img>
                    </Link>
                    <Typography component="h1" variant="h5">
                        Pasabili - Admin
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            color='primary'
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            value={admin.email}
                            onChange={handleChange}
                            autoComplete="email"
                            error={!!errors.email}
                            helperText={errors.email}
                            autoFocus
                        />
                        <TextField
                            color='primary'
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            value={admin.password}
                            onChange={handleChange}
                            id="password"
                            error={!!errors.password}
                            helperText={errors.password}
                            autoComplete="current-password"
                        />
                        <Button
                            disabled={loading || (!admin.email && !admin.password)}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            color='primary'
                            onClick={handleFormSubmit}
                        >
                            Sign In
                        </Button>
                        {loading ? <CircularProgress color="success" /> : <></>}
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}

export default LoginPage