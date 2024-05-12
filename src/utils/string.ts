export const generateRandomString = (
  len = 7,
  chars = "0123456789abcdefghijklmnopqrstuvwxyz",
) => {
  let result = "";

  for (let i = len; i > 0; i--) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};
