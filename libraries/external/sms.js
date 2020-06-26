const axios = require("axios").default;
const { deferrors, ClientError } = require("../error/index");

function request(options) {
  return axios(options)
    .then((res) => res.data)
    .catch((error) => {
      // throw new ClientError({
      //   code: deferrors.failed_to_kakao_auth.code,
      //   statusCode: error.response.statusCode,
      //   message: error.response.data,
      // });
    });
}

exports.sendSMS = async function(brand, mobileNumber, message) {

  console.log('send message completed!');
  // const options = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  //   method: "GET",
  //   baseURL: KAKAO_MANAGE_USER_URL,
  //   url: "/v2/user/me",
  // };

  // const data = await request(options);
  // console.log('verify', typeof data.id, typeof id);
  // if (data.id !== id) {
  //   throw new ClientError(deferrors.failed_to_kakao_auth);
  // }
}