import Register from "../Models/registermodel.js";

export const getAllUsers = async (req, res) => {
  try {
    const GetAlluser = await Register.find();
    if (!GetAlluser) {
      return res.status(401).json({
        success: false,
        message: "Users are not available",
        payload: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "All users has been found",
      payload: getAllUsers,
    });
  } catch (error) {
    console.error("Error :: getAllUser", error);
    return res.status(500).json({
      success: false,
      message: "Couldn't Feed getAllUsers",
      error: error,
    });
  }
};
