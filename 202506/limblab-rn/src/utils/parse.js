export const parseMessage = (message) => {
  return {
    _id: message?.state?.attributes.giftedId,
    text: message?.state?.body,
    createdAt: message?.state?.timestamp,
    user: {
      _id: message?.state?.author,
      name: message?.state?.author,
    },      
    received: true,
    read: false,
    urgent: message?.state.attributes.urgency
  };
};
