import UserModel from "../models/user.model";

export const generateUsername = async (name: string) => {

  const base = name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");

  let username = base;
  let counter = 1;

  while (await UserModel.findOne({ userName: username })) {
    username = `${base}${counter}`;
    counter++;
  }

  return username;
};