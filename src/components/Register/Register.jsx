import React, { useState } from 'react';
import {createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile} from 'firebase/auth';
import app from '../../firebase/firebase.config';
import { Link } from 'react-router-dom';

const auth = getAuth(app);

const Register = () => {
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    // const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        // prevent page reload
        event.preventDefault();
        setSuccess('')
        setError('')
        // collect form data
        const email = event.target.email.value;
        const password = event.target.password.value;
        const name = event.target.name.value;
        console.log(name, email, password)
        // validate
        if(!/.*[A-Z]/.test(password)){
            setError('Please add atleast one uppercase');
            return
        }
        else if(!/.*[0-9].*[0-9]/.test(password)){
            setError('Please add at least two numbers')
            return
        }
        else if(password.length<6){
            setError('please add atleast 6 character')
            return
        }
        // create user in firebase
        createUserWithEmailAndPassword(auth, email, password)
        .then( result =>{
            const loggedUser = result.user
            console.log(loggedUser)
            setError('');
            event.target.reset()
            setSuccess('User has been created successfully')
            sendVerificationEmail(result.user);
            updateUserData(result.user, name);

        })
        .catch(error => {
            console.error(error.message)
            setError(error.message)
            setSuccess('')
        })
    }

    const sendVerificationEmail = (user) =>{
        sendEmailVerification(user)
        .then(result => {
            console.log(result);
            alert('Please verify your email address')
        })
    }
    const updateUserData = (user, name) => {
        updateProfile(user,{
            displayName: name
        })
        .then( () =>{
            console.log('User Name Updated.')
        })
        .catch( error =>{
            setError(error.message);
        })
    }

    const handleEmailChange = (event) => {
        // console.log(event.target.value)
        // setEmail(event.target.value)
    }
    const handlePasswordBlur = (event) =>{
        // console.log(event.target.value)
    }
    return (
        <div className='w-50 mx-auto'>
            <h2>Please Register</h2>
            <form onSubmit={handleSubmit}>
                <input className='w-50 mb-4 rounded ps-2' type="text" name="name" id="name" placeholder='Your Name' required />
                <br />
                <input className='w-50 mb-4 rounded ps-2' onChange={handleEmailChange} type="email" name="email" id="email" placeholder='Your Email' required />
                <br />
                <input className='w-50 mb-4 rounded ps-2' onBlur={handlePasswordBlur} type="password" name="password" id="password" placeholder='Your Password' required />
                <br />
                <p className='text-danger'>{error}</p>
                <p className='text-success'>{success}</p>
                {/* <br /> */}
                <input className='btn btn-primary' type="submit" value="Register"  />
            </form>
            <p>Already Have An Account? Please <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Register;


// echo "# email-password-auth" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/shawon012/email-password-auth.git
// git push -u origin main