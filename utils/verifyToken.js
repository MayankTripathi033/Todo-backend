import jsonwebtoken from "jsonwebtoken";

export const verifyToken = (authorization) => {
  try {
    if (!authorization) {
      return false;
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      return false;
    }
    const decodedToken = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    return decodedToken;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return false;
  }
};
