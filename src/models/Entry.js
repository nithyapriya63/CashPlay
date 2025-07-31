export function getDefaultEntry({
  name = "",
  amount = 0,
  date = new Date(),
  user = {},
} = {}) {
  return {
    date: new Date(date).toISOString(),
    dataList: [
      {
        title: name,
        amount: amount,
      },
    ],
    user: {
      id: user.id || null,
      emailId: user.emailId || "",
      code: user.code || 0,
      expirationTime: new Date().toISOString(),
      accessToken: user.accessToken || "",
      refreshToken: user.refreshToken || "",
      status: user.status || "ACTIVE",
    },
  };
}
