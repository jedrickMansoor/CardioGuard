import { getAllUsers, getUserById, partialUpdateUser, updateUserPicture } from "../services/users.service";

// GET ALL USERS
export const getAllUsersController = async (req: any, res: any) => {
  const filters = req.query;
  const result = await getAllUsers(filters);
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(500).json(result);
  }
};

// GET USER BY ID
export const getUserByIdController = async (req: any, res: any) => {
  const { userId } = req.params;
  const result = await getUserById(userId);
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json(result);
  }
};

// PARTIAL UPDATE USER
export const partialUpdateUserController = async (req: any, res: any) => {
  const { userId } = req.params;
  const updateData = req.body;
  const result = await partialUpdateUser(userId, updateData);
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json(result);
  }
};

// UPDATE USER PICTURE
export const updateUserPictureController = async (req: any, res: any) => {
  try {
    const { userId } = req.params;

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | Express.Multer.File[];
    let pictureUrl: string | undefined;

    if (files) {
      if (Array.isArray(files)) {
        pictureUrl = files[0]?.path;
      } else {
        pictureUrl = files.picture?.[0]?.path;
      }
    }


    if (!pictureUrl) {
      return res.status(400).json({
        success: false,
        message: "Picture file is required",
      });
    }


    const result = await updateUserPicture(userId, pictureUrl);
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error: any) {
    console.error("Error updating user picture:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating picture",
    });
  }
};
