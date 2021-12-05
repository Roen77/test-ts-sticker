exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      name: "rone",
      age: 24,
      email: "aa@aa.com",
    }),
  };
};
