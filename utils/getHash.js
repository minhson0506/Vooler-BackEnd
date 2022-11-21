const bcrypt = require("bcryptjs");

const { salt } = require("../salt");
const getHash = (userId, password) => {
  const hashedUserId = bcrypt.hashSync(userId, salt);
  console.log("hashedUserId ", hashedUserId);
  const hashedPassword = bcrypt.hashSync(password, salt);
  console.log("hashedPassword ", hashedPassword);
  return { userId: hashedUserId, password: hashedPassword };
};

module.exports = { getHash };
