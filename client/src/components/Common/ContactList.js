import React, { useContext, useState, useEffect  } from 'react';
import UserListGroup from './UserListGroup';
import { AuthContext } from '../context/authContext';

export default function ContactList(props) {
    const auth = useContext(AuthContext);
    const [members, setMembers] = useState([]);

    let UserListGroupItem;

   
    const getData = (data, bool, color, index) => {
        
        if (bool === true) {
            let memberObj = {
                    color: color, 
                    username: data, 
                    key: index, 
                    name: data
                };
            setMembers([...members, memberObj]);
        }
        
        if (bool === false){
            let m = members.findIndex(x => x.username === data);
            if (m > -1) {
                members.splice(m, 1);
            }
            setMembers([...members]);
        }
    };

    useEffect(() => {
       
        if (props.listType === "GROUP_CHAT") {
            props.getMembersData(members);
        }
    },[members]);

    if (props.users !== null && typeof props.users !== 'undefined') {
      
        if (props.listType === "GROUP_CHAT") {
            UserListGroupItem = props.users.map((user, key) =>{
                return (
                    <UserListGroup 
                        key={key} 
                        type="USER_LIST_GROUP" 
                        listType={props.listType} 
                        letter={user.letter} 
                        users={user.names} 
                        getMembersData={getData}
                        selectContact={props.selectContact}/>
                )
            });
        } else {
            
            UserListGroupItem = props.users.map((user, key) =>
                <UserListGroup 
                    key={key} 
                    type="USER_LIST_GROUP" 
                    listType={props.listType} 
                    letter={user.letter} 
                    users={user.names}
                    selectContact={ props.selectContact }
                    getContactList={ props.getContactList }/>
            );
        }
    } else {
      
        UserListGroupItem = <div>Nothing here...</div>;
    }
    
    return (
        <div className="contact-list full-width col">
            { UserListGroupItem }
        </div>
    );
}
