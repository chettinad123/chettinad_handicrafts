import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    let folder = "chettinad/misc";

    switch (file.fieldname) {
      case "heroImage":
        folder = "chettinad/blogs/heroes";
        break;

      case "image":
        folder = "chettinad/blogs/content";
        break;

      case "profileImage":
        folder = "chettinad/users";
        break;

        case "documents":
  folder = "chettinad/documents";
  break;
        case "photo":
        folder = "chettinad/students";
        break;

         case "images":
    folder = "chettinad/media/images";
    break;

  case "video":
    folder = "chettinad/media/videos";
    break;

    case "galleryImage":                   
    folder = "chettinad/gallery";
    break;

    case "referenceImage":
  folder = "chettinad/custom-orders";
  break;

      default:
        folder = "chettinad/misc";
    }

    return {
      folder,
      resource_type: "auto",
    };
  },
});

const upload = multer({ storage });

export default upload;