export const getOtherPerson = (loginUser, users) => {
  return users[0]._id == loginUser.userId ? users[1].name : users[0].name;
};

export const isSameSender = (messages, currMessage, i, userId) => {
  const same =
    i < messages.length - 1 &&
    (messages[i + 1].sender._id != currMessage.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    currMessage.sender._id !== userId;
  //console.log(same, i);
  return same;
};

export const isLastMessage = (messages, i, userId) => {
  const last =
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId;
  //console.log(last, i, ".........");
  return last;
};
