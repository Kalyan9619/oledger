import React, { useContext, useEffect } from 'react'
import UserListItem from './UserListItem';
import { AuthContext } from '../context/authContext';

const UserList = (props) => {
    const userContext = useContext(AuthContext);

    if (props.searching === true) {
        return (
            <div className="user-list col padding-20 align-center">
                Searching...
            </div>
        )
    } else if (props.users === null || props.users.length === 0 || props.users === undefined) {
        return (
            <div className="user-list col padding-20 align-center">
                Here you can search for users.
            </div>
        )
    } else if (props.users !== null && props.users.length !== 0 && props.users !== undefined) {
        return (
            <div className="user-list col">
                {
                   
                    props.users.map((user, index) => {

                       
                        if (userContext.currUser._id !== user._id) {
                            let newUserContactsArray = [];

                            user.contacts.forEach(contact => {
                                let contactId = contact.user;
                               
                                return newUserContactsArray.push(contactId);
                            });
                            
                          
                            if (newUserContactsArray.includes(userContext.currUser._id)) {
                                
                                return <UserListItem key={index} name={user.username} id={user._id} alreadyAdded="Already a friend"/>
                            } else {
                                
                                return <UserListItem key={index} name={user.username} id={user._id} alreadyAdded="" loadUsers={props.loadUsers}/>
                            }
                        }
                    })
                }
            </div>
        )
    } else {
        return (
            <div className="user-list col">
                Sorry, we found no users T_T
                <br></br>
            </div>
        )
    }
}

export default UserList;
