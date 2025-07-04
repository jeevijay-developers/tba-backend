const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
// Configuration
cloudinary.config({
  cloud_name: "dpblzxtkl",
  api_key: process.env.NEXT_AUTH_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_AUTH_CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "users",
        resource_type: "image",
        transformation: [{ quality: "auto:best" }, { fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = uploadToCloudinary;
