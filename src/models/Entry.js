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

export function getDefaultUpdateEntry({
  id = null,
  name = "",
  amount = 0,
  date = new Date(),
  user = {},
} = {}) {
  return {
    id: id,
    title: name,
    amount: amount,
    date: new Date(date).toISOString(),
    user: {
      id: user.id || null,
      emailId: user.emailId || "",
      code: user.code || 0,
      expirationTime: user.expirationTime
        ? new Date(user.expirationTime).toISOString()
        : new Date().toISOString(),
      accessToken: user.accessToken || "",
      refreshToken: user.refreshToken || "",
      status: user.status || "ACTIVE",
    },
  };
}
