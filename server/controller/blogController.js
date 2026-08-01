import blogService from "../services/blogService.js";

/* ─── Helper: safely parse tags from multipart form-data ─────────────── */
const parseTags = (rawTags) => {
  if (!rawTags) return [];

  try {
    const parsed = JSON.parse(rawTags);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return String(rawTags)
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
};


const mergeImageBlocks = (content, files, rawPositions) => {
  if (!files?.length) return content;

  let positions = [];
  if (rawPositions) {
    try {
      const parsed = JSON.parse(rawPositions);
      if (Array.isArray(parsed)) positions = parsed;
    } catch {
      positions = [];
    }
  }

  const merged = [...content];

  files.forEach((file, i) => {
    const imageData = {
      type: "image",
      imageurl: {
        url: file.path,
        publicId: file.filename,
      },
    };

    const pos = positions[i];

    if (
      Number.isInteger(pos) &&
      merged[pos] &&
      merged[pos].type === "image"
    ) {
      // Replace placeholder in-place, keep its id/alt/caption/etc.
      merged[pos] = { ...merged[pos], ...imageData };
    } else {
      // No valid position (or position doesn't line up) — append safely
      merged.push(imageData);
    }
  });

  return merged;
};

/* ─── Create ───────────────────────────────────────────────────────── */
const create = async (req, res) => {
  try {
    let content = req.body.content ? JSON.parse(req.body.content) : [];
    const tags = parseTags(req.body.tags);

    let heroimage = null;
    if (req.files?.heroImage?.[0]) {
      heroimage = {
        url: req.files.heroImage[0].path,
        publicId: req.files.heroImage[0].filename,
      };
    }

    content = mergeImageBlocks(
      content,
      req.files?.image,
      req.body.imagePositions
    );

    const blog = await blogService.create(
      {
        ...req.body,
        tags,
        heroimage,
        content,
      },
      req.user
    );

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ─── Get All ──────────────────────────────────────────────────────── */
const getAll = async (req, res) => {
  try {
    const blogs = await blogService.getAll();

    return res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ─── Get By Id ────────────────────────────────────────────────────── */
const getById = async (req, res) => {
  try {
    const blog = await blogService.getById(req.params.id);

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ─── Update ───────────────────────────────────────────────────────── */
const update = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.content) {
      updateData.content = JSON.parse(req.body.content);
    }

    if (req.body.tags !== undefined) {
      updateData.tags = parseTags(req.body.tags);
    }

    if (req.files?.heroImage?.[0]) {
      updateData.heroimage = {
        url: req.files.heroImage[0].path,
        publicId: req.files.heroImage[0].filename,
      };
    }

    updateData.content = mergeImageBlocks(
      updateData.content || [],
      req.files?.image,
      req.body.imagePositions
    );

    const blog = await blogService.update(
      req.params.id,
      updateData,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ─── Remove ───────────────────────────────────────────────────────── */
const remove = async (req, res) => {
  try {
    await blogService.remove(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  create,
  getAll,
  getById,
  update,
  remove,
};