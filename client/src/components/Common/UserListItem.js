import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import { useHistory } from 'react-router-dom';
import Popup from '../Common/SuccessErrorPopup/Popup';

const UserListItem = (props) => {
    const userContext = useContext(AuthContext);
    const history = useHistory();
    const [color, setColor] = useState(null);
    const [visible, setVisibility] = useState(false);
    const [deleteUserPopup, setDeleteUserPopup] = useState(null);
    
   
    const apiCall = (event) => {
        event.preventDefault();

      
        axios.get('/api/users/new-contact/' + props.name)
            .then(() => {
                createChat();
            })
            .then((newContact) => {
               
                props.loadUsers();
            })
            .catch(err => {
                console.log(err);
            });
    };

    
    const updateContacts = () => {
        props.getContactList();
    }

    const getAvatarColor = () => {
        let avatarId = props.userId !== undefined ? props.userId : props.id;
    
        if (props.userId !== undefined || props.id !== undefined) {
            axios.get('/api/users/' + avatarId)
            .then((newContact) => {
                if (newContact.data.avatarColor !== null && newContact.data.avatarColor !== undefined){
                    setColor(newContact.data.avatarColor);
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    useEffect(() => {
        getAvatarColor();
    });

    const createChat = () => {
        const data = {
            members: [
                props.name,
                userContext.currUser.username
            ]
        };

        const config = {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        axios.post('/api/chats', data, config)
            .then(() => { })
            .catch(err => console.log(err));
    };

    
    const addUserToGroup = (event) => {
        if (event.target.checked === true) {
            props.getMembersData(props.name, true, color, props.index);
        } else {
            props.getMembersData(props.name, false, color, props.index);
        }
    };

    
    const editContact = (event) => {
        event.preventDefault();

        const nickname = document.getElementById("nickname").value;

        const data = { nickname };

        const config = {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        axios.post('/api/users/update-contact/' + props.name, data, config)
            .then((response) => {
                history.push('/all');
            })
            .catch(err => console.log(err));
        };


    
   const deletePopupHandler = () => {
        setDeleteUserPopup(true);
   }

   
   let deletePopup = 
        deleteUserPopup === true ? (
            <Popup clearPopupState={() => clearPopuState()}>
                <h3>Delete Contact</h3>
                <p className="p-popup">Are you sure you want to delete this contact?</p>
               <button className="contact-button-delete margin-xs" onClick={() => removeContact()}>Delete</button>
            </Popup> ) : null;
    

     const clearPopuState = () => {
        setDeleteUserPopup(null);
        setVisibility(false);
    }

    
    let editPopup = 
    visible === true ? (
        <Popup clearPopupState={() => clearPopuState()}>
            <h3>Add a nickname...</h3>
            <form onSubmit={editContact}>
                <input id="nickname" placeholder="Add a nickname..." className="add-nickname-input"/>
                <input type="submit" value="Add" className="add-nickname-edit"/>
                <button onClick={() => setVisibility(false)} className="add-nickname-cancel">Cancel</button>
            </form>
        </Popup> ) : null;

   
    const removeContact = () => {
        axios.get('/api/users/remove-contact/' + props.name)
            .then((deletedUser) => {
                updateContacts();
                
            })
            .catch(err => console.log(err));
    };

   
    if (props.selectContact !== undefined){
        return (
            <div className="user-list-item padding-20 row">
                {editPopup}
                {deletePopup}
                { }
                <div className="user-list-img-col clickable" onClick={() => props.selectContact(props.id)}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" className="svg-inline--fa fa-user fa-w-14 svg-avatar-nav" role="img" viewBox="0 0 448 512"><path
                        fill={color}
                        d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                </div>
                { }
                <div className="col">
                    {}
                    <div className="row height-50 space-between align-center clickable" onClick={() => props.selectContact(props.id)}>
                        <h3>{props.name}</h3>
                    </div>
                    { }
                    <div className="row height-50 space-between align-center">
                        { }
                        <span>{ props.nickname !== "" && props.nickname !== null && props.nickname !== undefined ? props.nickname : null }</span>
                    </div>
                </div>
                <div className="contact-buttons">
                    
                    <button className="contact-button-edit" onClick={() => setVisibility(true)}>Edit</button>
                    <button className="contact-button-delete" onClick={deletePopupHandler}>Delete</button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="user-list-item padding-20 row" >
                { }
                <div className="user-list-img-col">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" className="svg-inline--fa fa-user fa-w-14 svg-avatar-nav" role="img" viewBox="0 0 448 512"><path
                        fill={color}
                        d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                </div>
                { }
                <div className="col">
                    { }
                    <div className="row height-50 space-between align-center">
                        <h3>{props.name}</h3>
                    </div>
                    {}
                    <div className="row height-50 space-between align-center">
                        <p>{props.alreadyAdded}</p>
                    </div>
                </div>
                {
                   
                    props.type === "USER_LIST_GROUP" ? (
                      
                        props.listType === "GROUP_CHAT" ? (
                            <div className="group-checkbox-col justify-center">
                                <div className="checkbox-wrap">
                                    <input 
                                        className="checkbox" 
                                        type="checkbox" 
                                        id={"checkbox_" + props.index + props.name} 
                                        onChange={addUserToGroup} />
                                    <label 
                                        className="checkmark" 
                                        htmlFor={"checkbox_" + props.index + props.name} >
                                    </label>
                                </div>
                            </div>
                        ) : null
                    )
                    : (
                        <div className="user-list-button-col">
                            {props.alreadyAdded === "Already a friend" ? "" : <button onClick={apiCall} id={props.name} className="contact-button-edit">Add friend</button>}
                        </div>
                    )
                }

            </div>
        )
    }

}

export default UserListItem;