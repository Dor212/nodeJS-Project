export const isBuissines = (req, res, next) => {
  if (!req.user.isBuissines) {
    return res.status(403).json({ message: "You are not a business user." });
  }
  return next();
};
