import jsonwebtoken from "jsonwebtoken";

export const verifyToken = (authorization) => {
  try {
    if (!authorization) {
      return false;
    }
    let isExpiredToken = jsonwebtoken.verify(
      authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    if (isExpiredToken.exp < Date.now().valueOf() / 1000) {
      return false;
    } else {
      return isExpiredToken;
    }
  } catch (error) {
    console.log("verifyToken Error", error);
    return error;
  }
};
