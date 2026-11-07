// contain all constant Enums and const variables

export const genderEnum = { MALE: "Male", FEMALE: "Female" };

export const roleEnum = {
  USER: "user",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
};

export const TokenTypeEnum = {
  ACCESS: "access",
  REFRESH: "refresh",
};

export const allowedExtensions = {
  image: ["png", "jpeg", "heic"],
  vedio: ["mp4"],
  application: ["pdf", "xlxs"],
};

export const normalizedExt = {
  jpeg: "jpg",
  jpe: "jpg",
};

export const providersEnum = {
  SYSTEM: "system",
  GOOGLE: "google",
};

export const TypeSenderReceiverEnum = {
  RECEIVER: "0",
  SENDER: "1",
  BOTH: "2",
};

export const requestStatusEnum = {
  PENDING: "pending",
  REJECTED: "rejected",
  ACCEPTED: "accepted",
};
