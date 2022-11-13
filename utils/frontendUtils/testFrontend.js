const { register, login } = require("./frontendUtils");
const { createDbConnection } = require("../../db");
let db = createDbConnection();

const userId = "Test";
const password = "1234";

const testAuthentication = async () => {
  const res = await register(userId, password)
    .then((res) => {
      console.log("register response ", res);
      // new Promise((r) => setTimeout(r, 5000));
      const resLogin = login(userId, password);
      return resLogin;
    })
    .then((res) => console.log("login response", res));
};

testAuthentication();
