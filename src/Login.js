import React, { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';


const Login = () => {

    const responseGoogle = async (response) => {
        if(response.credential) {
            localStorage.setItem('token', response.credential)
        }
        window.location.reload(false);
    }
    
    return (
        <div className='container'>
            
            <div>
            {/* <div className=""> */}
            <GoogleOAuthProvider 
                clientId="115654340301-ogjm4bt6isejfr39cguc8me98n2a0uc4.apps.googleusercontent.com"
                >
             <GoogleLogin
              render={(renderProps) => (
                <button
                  type="button"
                  className=""
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="" /> Sign in with google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
            </GoogleOAuthProvider>
          {/* </div> */}
                <Link to = "/leaderboard" style={{ textDecoration: "none", color: "white" }}> <button> Leaderboard </button> </Link>
            </div>
        </div>
    );
}

export default Login;
