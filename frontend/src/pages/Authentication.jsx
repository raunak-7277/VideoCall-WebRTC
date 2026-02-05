import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar"; 
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { AuthContext } from "../context/AuthContext";


const theme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function Authentication() {
const [username, setUsername] = React.useState("");
const [password, setPassword] = React.useState("");
const [name, setName] = React.useState("");
const [error, setError] = React.useState("");
const [message, setMessage] = React.useState("");


  const [formState, setFormState] = React.useState(0);

  const [open, setOpen] = React.useState(false)

  const { handleLogin,  handleRegister} = React.useContext(AuthContext);


  let handelAuth= async()=>{

    if(formState===0){
      const result =await handleLogin(username,password)
      if (result.success) {
        setMessage( "Login Successful!")
        setError("");
      } else {
        setError(result.message);
      }
    } 
   
     if (formState === 1) {
      
      const result = await handleRegister(name, username, password);
      

      if (result.success) {
        setMessage( "Registration Successful!")
        setOpen(true);
        setError("");
        setFormState(0); 
      } else {
        setError(result.message);
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        component="main"
        sx={{
          height: "100vh",
         
          backgroundImage: "url(https://images.unsplash.com/photo-1585974738771-84483dd9f89f?q=80&w=1072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          justifyContent: "flex-end", 
        }}
      >
        <CssBaseline />
        

        {/* --- RIGHT FORM --- */}
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          // Add some transparency to the form so the image bleeds through slightly?
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }} 
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              {formState === 0 ? "Sign In" : "Sign Up"}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                variant={formState === 0 ? "contained" : "outlined"}
                sx={{ mr: 1 }}
                onClick={() => setFormState(0)}
              >
                Sign In
              </Button>
              <Button
                variant={formState === 1 ? "contained" : "outlined"}
                onClick={() => setFormState(1)}
              >
                Sign Up
              </Button>
            </Box>

            <Box component="form" sx={{ mt: 3, width: "100%" }}>
              {formState === 1 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p style={{ color: "red" }}>{error}</p>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handelAuth}
              >
                {formState === 0 ? "Login" : "Register"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
            <Snackbar
      
                      open={open}
                      autoHideDuration={4000}
                      message={message}
                      onClose={() => setOpen(false)}
                  />
    </ThemeProvider>
  );
}