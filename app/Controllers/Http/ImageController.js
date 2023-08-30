"use strict";
const Image = use("App/Models/Image");
const Database = use("Database");
// uer for upload image
const Helpers = use("Helpers");
// create random value for image name
const moment = require("moment");
// Random PIN generation
const RandomData = use("randomatic");
const path = require("path");
const fs = require("fs");
const Drive = use("Drive");
const Env = use("Env");
const AuthorizationService = use("App/Services/AuthorizationService");

class ImageController {
  // view user image
  async view({ auth, response }) {
    try {
      // get user data
      // const user = await auth.getUser();

      // const userInfo = await Database.table("hostel_user")
      //   .where("user_id", user.id)
      //   .select("user_id")
      //   .first();

      // const userId = userInfo.user_id;
      // console.log(userId)
      // return

      //get env data
      const s3_Url = Env.get("S3_BUCKET_URL");
      // console.log(s3_Url, "url");
      // return

      // get user id
      const userId = await auth.user.id;
      // console.log(userId);
      // return

      //get image url from db
      const imageUrl = await Database.table("images")
        // .query()
        // .join("hostel_user", "hostel_user.id", "images.hostel_user_id")
        .where("images.user_id", userId)
        .where("status", 1)
        .select("image_url");
      // .fetch();

      // if image not exists
      if (imageUrl == "") {
        return "Image not exists";
      } else {
        // make row data to simple data
        const userImageUrl = imageUrl.map((i) => i.image_url);

        // create user image url
        const userImage = s3_Url + "/" + userImageUrl;
        // console.log(userImage, "user image");
        return userImage;
        // return {
        //   s3_Url,
        //   userImage,
        // }
      }
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Image does not exist",
      });
    }
  }
  // upload user image
  async upload({ response, request, auth }) {
    try {
      // get user data
      // const user = await auth.getUser();
      // get user id
      const userId = await auth.user.id;

      // check user image exists or not
      const userDetails = await Database.table("images")
        .where("user_id", userId)
        .where("status", 1)
        .select("image_url");
      //create row data to simple data
      const userImage_url = userDetails.map((i) => i.image_url);
      const oldPath = userImage_url[0];
      // console.log(old, "user details");
      // return

      // console.log(userId, "user id");
      // return
      // console.log(user.toJSON());
      // return

      // const userdata = await Database.table('hostel_user')
      //   .where('user_id', user.id)
      //   .select('type', 'user_id')
      //   .first()
      // console.log(userdata)
      // return
      // get user id
      // const user_id = request.input("user_id");
      // console.log(user_id);
      // return
      // const hosteldata = await Database.table('hostel_user')
      //   .where('user_id', user.id)
      //   .select('id', 'user_id')
      //   .first()
      // console.log(hosteldata)
      // return
      // const id = hosteldata.id
      // console.log(id);
      // return
      // Authorization Permission
      // AuthorizationService.verifyPermissionUser(userdata, hosteldata)

      // get user image
      const image_url = request.file("image_url");

      // checking files are valid
      const allowedTypes = ["png", "PNG", "jpg", "jpeg", "JPEG", "JPG"];

      const fileExt = image_url.extname;

      if (!allowedTypes.includes(fileExt)) {
        return "Invalid File Extension";
      }

      //check image size
      if (image_url.size > 2000000) {
        return "Maximum image size 2MB";
      }
      // send data for upload image in s3 bucket
      let uploadToS3I = await this.uploadToS3(image_url, oldPath);
      // return uploadToS3I

      // create image name
      // const imageName = moment().utc() + "_imagename-name.jpg";
      // console.log(imageName)
      // return

      // image move to public folder
      // await image_url.move(Helpers.publicPath("uploads"), {
      //   name: imageName,
      //   overwrite: true,
      // });
      // console.log(image_url);
      // return;

      // check image move or not
      // if (!image_url.moved()) {
      //   return image_url.error();
      // }

      // user image not exists
      if (userDetails == "") {
        // console.log("if");
        // access Hostel table
        const image = new Image();
        // insert image in db images table
        image.fill({
          image_url: uploadToS3I.path,
          status: 1,
          user_id: userId,
        });
        await image.save();
        return "Image uploaded successfully";
      } else {
        // if user image exists then update image url
        const user_image = await Database.table("images")
          .where("user_id", userId)
          .where("status", 1)
          .update("image_url", uploadToS3I.path);

        return "Image uploaded successfully";
      }
    } catch (error) {
      // console.log(error);
      return response.status(500).send({
        error: "Image upload failed",
      });
    }
  }
  // update user image
  async update({ auth, params, response, request }) {
    try {
      // image update not need

      // get user data
      const user = await auth.getUser();

      const userdata = await Database.table("hostel_user")
        .where("user_id", user.id)
        .select("id")
        .first();
      // console.log(userdata, "user data")
      // return
      // get id for update
      // const { id } = params
      // find data from Hostel table for update
      const userUpdate = await Image.find(userdata.id);
      // console.log(userUpdate.toJSON(), "update");
      // return
      // check hostel_id for update data
      // const hosteldata = await Database.table('hostel_user')
      //   .where('id', userUpdate.hostel_user_id)
      //   .select('user_id')
      //   .first()
      // console.log(hosteldata)
      // return
      // Authorization Permission
      // AuthorizationService.verifyPermissionUser(userdata, hosteldata)

      // get user image
      const image_url = request.file("image_url", {
        types: ["image"],

        size: "2mb",
      });

      const imageName = moment().utc() + "imagename-name.jpg";
      // console.log(imageName)
      // return
      await image_url.move(Helpers.publicPath("uploads"), {
        name: imageName,
        overwrite: true,
      });
      // console.log(image_url);
      // return;

      if (!image_url.moved()) {
        return image_url.error();
      }
      // update image
      const updateImage = await Database.table("images")
        .where("images.id", userUpdate.id)
        .update({
          image_url: imageName,
        });

      // return updateUser;
      return "success update";
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Image update failed",
      });
    }
  }
  // destroy user image
  async destroy({ auth, params, response }) {
    try {
      // get user data
      // const user = await auth.getUser();
      // const userdata = await Database.table("hostel_user")
      //   .where("user_id", user.id)
      //   .select("type", "user_id")
      //   .first();

      const userId = await auth.user.id;

      // get user details from image table
      const userDetails = await Database.table("images")
        .where("user_id", userId)
        .where("status", 1)
        .select("id", "image_url")
        .first();

      // if old path exists then delete old path
      const oldPath = userDetails.image_url;
      if (oldPath) {
        const exists = await Drive.disk("s3").exists(oldPath);
        if (exists) {
          await Drive.disk("s3").delete(oldPath);
        }
      }

      // Authorization Permission
      // AuthorizationService.verifyPermissionUser(userdata, hosteldata);

      // get id for update
      const id = userDetails.id;

      // find image for update
      // const userDestroy = await Image.find(id);

      // update status value
      // userDestroy.status = 0;
      // await userDestroy.save();
      const userDestroy = await Database.table("images")
        .where("id", id)
        .delete();
      return userDestroy;
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "destroy failed",
      });
    }
  }
  // upload image to s3 bucket
  async uploadToS3(file, oldPath) {
    try {
      // if old path exists then delete old path
      if (oldPath) {
        const exists = await Drive.disk("s3").exists(oldPath);
        if (exists) {
          await Drive.disk("s3").delete(oldPath);
        }
      }
      // create folder for upload image in s3 bucket
      const folder = "profile-pictures";
      // Create a random name for file
      const randomName =
        Math.random().toString(36).substring(2, 15) + moment().utc();

      const fileName = `${Date.now()}${randomName}.${file.subtype}`;

      // Sets the path and move the file
      const filePath = `${path.resolve(`./tmp/${folder}/`)}/${fileName}`;

      await file.move(Helpers.tmpPath(folder), {
        name: fileName,
        overwrite: true,
      });

      const fileStream = await fs.createReadStream(filePath);
      const fileSize = await file.stream.byteCount;

      // Uploads the file to Amazon S3 and stores the url
      const s3Path = `/${fileName}`;
      // use Drive install npm and add file drive.js inside config folder
      await Drive.disk("s3").put(s3Path, fileStream, {
        ACL: "public-read",
        ContentType: `${file.type}/${file.subtype}`,
      });
      const fileUrl = await Drive.disk("s3").getUrl(s3Path);

      // Destroy the readable stream and delete the file from tmp path
      await fileStream._destroy();
      await Drive.delete(filePath);
      return {
        name: fileName,
        path: s3Path,
        size: fileSize,
        url: fileUrl,
      };

      // console.log(filePath, "file path");
      // return
    } catch (error) {
      // return 1
      console.log(error);
    }
  }
}

module.exports = ImageController;
