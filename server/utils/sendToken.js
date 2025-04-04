export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  // Convert COOKIE_EXPIRED to a valid number
  const cookieExpirationDays = Number(process.env.COOKIE_EXPIRED) || 7; // Default to 7 days

  res
    .status(statusCode)
    .cookie("token", token, {  // ✅ Use `token`, not `user.token`
      expires: new Date(Date.now() + cookieExpirationDays * 24 * 60 * 60 * 1000), // ✅ Ensure a valid expiration date
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json({
      success: true,
      user,
      message,
      token,  // ✅ Ensure correct token is returned
    });
};
