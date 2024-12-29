import jsonwebtoken from "jsonwebtoken";

export const verifyToken = (authorization) => {
  try {
    if (!authorization) {
      return "Please Provide Authorization in order to Submit";
    }
    let isExpiredToken = jsonwebtoken.verify(
      authorization.split(" ")[1],
      process.env.JWT_SECRET
    ).exp;
    if (isExpiredToken < Date.now().valueOf() / 1000) {
      return "Toke has been expired";
    }
  } catch (error) {
    return `Token couldn't be verified ${error}`;
  }
};
