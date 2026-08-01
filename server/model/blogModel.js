import mongoose from "mongoose";
import slugify from "slugify";


const ContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "heading",
        "text",
        "list",
        "image",
        "quote",
        "code",
        "link",
        "proTip",
        "button",
      ],
      required: true,
    },

    text: String,

    href: String,

    level: {
      type: String,
      enum: ["h1", "h2", "h3", "h4"],
    },

    style: {
      type: String,
      enum: ["bullet", "number"],
    },

    items: [String],

    imageurl: {
      url: String,
      publicId: String,
    },
    buttonTarget:{
        type:String,
        enum:["_self","_blank"],
        default:"_self"
    }
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    tags: [
      {
        type: String,
      },
    ],

    author: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    heroimage: {
      url: {
        type: String,
        default: null,
      },
      publicId: {
        type: String,
        default: null,
      },
    },

   
    // ✅ Using separate schema
    content: [ContentSchema],

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre("save", async function () {
  if (!this.isModified("title")) return;

  const Blog = mongoose.model("Blog");

  let slug = slugify(this.title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let uniqueSlug = slug;
  let counter = 1;

  while (
    await Blog.findOne({
      slug: uniqueSlug,
      _id: { $ne: this._id },
    })
  ) {
    uniqueSlug = `${slug}-${counter++}`;
  }

  this.slug = uniqueSlug;
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
