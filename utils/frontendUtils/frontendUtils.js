"use strict";
const axios = require("axios");
const bcrypt = require("bcryptjs");
const { response } = require("express");
const url = "http://localhost:3000";

const getHash = (userId, password, salt) => {
  const hashedUserId = bcrypt.hashSync(userId, salt);
  console.log("hashedUserId ", hashedUserId);
  const hashedPassword = bcrypt.hashSync(password, salt);
  console.log("hashedPassword ", hashedPassword);
  return { userId: hashedUserId, password: hashedPassword };
};

const getSalt = async () => {
  const salt = await axios
    .get(url + "/auth/salt")
    .then(async (response) => {
      const salt = response.data.salt;
      console.log("Response", salt);
      return salt;
    })
    .catch((e) => console.log(e));
  return salt;
};

const generateHash = async (userId, password) => {
  var salt = await getSalt();
  console.log("Salt", salt);
  return getHash(userId, password, salt);
};

const postUserInfo = async (userId, password, endpoint) => {
  const userObj = await generateHash(userId, password);
  //   const options = {cl
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(userObj),
  //   };
  const res = await axios
    .post(`${url}/auth/${endpoint}`, userObj)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.log(e);
    });
  return res;
};

const register = async (userId, password) => {
  const res = await postUserInfo(userId, password, "register");
  //   if (!res.message.user_id) {
  //     console.log("cannot register");
  //   } else return res;
  return res;
};

const login = async (userId, password) => {
  const res = await postUserInfo(userId, password, "login");
  //   if (!res.message.user_id) {
  //   console.log("cannot register");
  //   } else return res;
  return res;
};

module.exports = { register, login };
