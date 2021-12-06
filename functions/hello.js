exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      name: "roen",
      age: 85,
      email: "gksthd12345@gmail.com",
    }),
    // 바디는 문자만가능하다
  };
};
