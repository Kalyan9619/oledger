import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Input from '../Common/FormElements/Input';
import Button from '../Common/Button/Button';
import { useForm } from '../hooks/formHook';
import { VALIDATOR_EMAIL, VALIDATOR_REQUIRE } from '../util/validator';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import Popup from './SuccessErrorPopup/Popup';
import {userSvg} from '../images/user-solid.svg';

const SettingItem = (props) => {
    const [formState, inputHandler] = useForm(
       
        {
            email: {
                value: props.auth.email,
                isValid: true
            },
            name: {
                value: props.auth.name,
                isValid: true
            },
            username: {
                value: props.auth.username,
                isValid: true
            },
            address: {
                value: props.auth.address,
                isValid: true
            }
        },
        {
            isValid: true
        }
    );

    const auth = useContext(AuthContext);
    const history = useHistory();

    const [avatarColor, setAvatarColor ] = useState(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const [deleteCurrUser, setDeleteCurrUser] = useState(null);

 
    const onSubmitHandler = (event) => {
        event.preventDefault();
        
         const data = {
            email: formState.inputs.email.value,
            name: formState.inputs.name.value,
            username: formState.inputs.username.value,
            address: formState.inputs.address.value,
            avatarColor: avatarColor
        }
        
        const config = {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        
        axios.post('/api/users/update-user', data, config)
        .then((data) => {
         
            let user = auth.currUser;

            if(user.address !== data.data.address){
               
                user.address = data.data.address;
            }  
           
            if(user.avatarColor !== data.data.avatarColor){
               
                user.avatarColor = data.data.avatarColor;
            }
           
            if(user.email !== data.data.email){
                
                user.email = data.data.email;
            }
             
            if(user.name !== data.data.name){
                
                user.name = data.data.name;
            }
            history.push('/profile');
        })
        .then(() => {
            if(success == null){
               setSuccess(true);
            }
        })
        .catch((err) => {
            console.log(err);
            setError(true);
        });
    }

    const setColorHandler = (event) => {
        setAvatarColor(event.target.value);
    }

   
    const deleteUserHandler = () => {
        setDeleteCurrUser(true);
    }

    let deleteUserPopup = 
        deleteCurrUser === true ? (
            <Popup clearPopupState={() => clearPopuState()}>
                <h3>Delete Account</h3>
                <p>Are you sure you want to delete this account?</p>
                <button className="delete-user-btn delete-user-btn-mobile" onClick={() => deleteUser()}>Delete account</button>
            </Popup> ) : null;

  
    const deleteUser = () => {
        axios.get('/api/users/' + auth.currUser._id + '/delete')
            .then(() => {
                auth.loggedIn = false;
                auth.currUser = null;
                history.push('/');
            })
            .catch(err => console.log(err))
    }

    
    let successMessage = 
        success === true ? (
            <Popup clearPopupState={() => clearPopuState()}>
                <h3>Success!</h3>
                <p>Profile Updated</p>
            </Popup> ) : null;

  
    let errorMessage = 
        error === true ? (
            <Popup clearPopupState={() => clearPopuState()}>
                <h3>Error!</h3>
                <p>Something went wrong. Please try again.</p>
            </Popup> ) : null;
    
   
     const clearPopuState = () => {
        setError(null);
        setDeleteCurrUser(null);   
        setSuccess(null);
    }
     
    

    return (
        <div className="row padding-32 scrollable">
            {deleteUserPopup}
            {successMessage}
            {errorMessage}
            <div className="col">
                <div className="row justify-center padding-20 settings-wrap">
                    <div className="avatar-border">
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" className="svg-inline--fa fa-user fa-w-14 absolute-center" role="img" viewBox="0 0 448 512"><path fill={avatarColor ? avatarColor : auth.currUser.avatarColor} d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                    </div>
                </div>

                <div className="row col justify-center margin-xs">
                    <h2 className="text-center">{formState.inputs.name.value}</h2>
                    <h5 className="text-center">{formState.inputs.username.value}</h5>
                </div>

                <div className="flex-container justify-center margin-s" onChange={setColorHandler}>
                   
                </div>

                <div className="row column">
                    <h4>Edit Profile</h4>
                </div>

                <div className="align-center row margin-top-s">
                    <form className="row" onSubmit={onSubmitHandler}>
                        <Input 
                            id="name"
                            type="text"
                            label="Name"
                            valid={true}
                            value={formState.inputs.name.value}
                            errorText="Please enter your name."
                            validator={[VALIDATOR_REQUIRE()]}
                            onInput={inputHandler}
                            inputStyle="hide-text-input-field"
                            inputContainerStyle="margin-s input-field grey-bg"
                            labelStyle="input-field-label-active"
                            errorStyle="error-border"
                            />
                        <Input 
                            id="email"
                            type="email"
                            label="Email"
                            valid={true}
                            value={formState.inputs.email.value}
                            errorText="Please enter a valid email."
                            validator={[VALIDATOR_EMAIL()]}
                            onInput={inputHandler}
                            inputStyle="hide-text-input-field"
                            inputContainerStyle="margin-s input-field grey-bg"
                            labelStyle="input-field-label-active"
                            errorStyle="error-border"
                            />
                        <Input 
                            id="address"
                            type="text"
                            label="Address"
                            valid={true}
                            value={formState.inputs.address.value}
                            errorText="Please enter your address."
                            validator={[VALIDATOR_REQUIRE()]}
                            onInput={inputHandler}
                            inputStyle="hide-text-input-field"
                            inputContainerStyle="margin-s input-field grey-bg"
                            labelStyle="input-field-label-active"
                            errorStyle="error-border"
                            />

                        <Button 
                            type="submit"
                            btnStyle="Button margin-xs"
                            disabledBtn={!formState.isValid}>Save</Button>
                    </form>

                    <button className="delete-user-btn delete-user-btn-mobile" onClick={deleteUserHandler}>Delete account</button>
                </div>
            </div>
        </div>
        
    )
}

export default SettingItem;
