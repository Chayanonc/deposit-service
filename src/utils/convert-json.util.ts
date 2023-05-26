export const stringToJson = (message: any) => {
  return JSON.parse(message.value.toString());
};
