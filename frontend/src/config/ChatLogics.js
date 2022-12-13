//they return boolean for styling purposes.

//for margin
export const messageMargin = (userId) => { //left right align
  const id = JSON.parse(localStorage.getItem("userInfo"))._id
    if (id===userId)
      return 'auto';
    else
      return 0;
  };

  //for avatar
  export const messageAvatar = (messages,i) => {
    const id = JSON.parse(localStorage.getItem("userInfo"))._id
      if ((i<messages.length-1 && messages[i].sender._id!==id) && messages[i+1].sender._id===id ) // i+1 msg is of logged user and i msg is not of logged user then put avatar.
        return true;
      else if(messages[i+1]===undefined && messages[i].sender._id!==id)
      {
        return true
      }  
      else{
        return false
      }    
    };

export const isSameUser = (messages, m, i) => { //for margin top of same user msgs
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};


//for showing name in msg.
export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

//for user profile modal
export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
