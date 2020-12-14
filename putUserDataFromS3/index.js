const AWS = require("aws-sdk");

const s3 = new AWS.S3();

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { name } = event.Records[0].s3.bucket;
  const { key } = event.Records[0].s3.object;

  const getObjectparams = {
    Bucket: name,
    Key: key,
  };

  try {
    const s3Data = await s3.getObject(getObjectparams).promise();
    const usersStr = s3Data.Body.toString();
    const usersJSON = JSON.parse(usersStr);
    console.log("userStr", usersStr);

    const { id, firstname, lastname } = usersJSON[0];

    const putParams = {
      TableName: "Users",
      Item: {
        id: id,
        firstname: firstname,
        lastname: lastname,
      },
    };
    try {
      const putItemData = await documentClient.put(putParams).promise();
      console.log(putItemData);
    } catch (error) {
      console.log("Can't put users in DynamoDB");
      console.log(error);
    }
  } catch (error) {
    console.log("Can't get users from s3");
    console.log(error);
  }
};
