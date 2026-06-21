import Product from "../models/Product.js";

export const getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    let query = { isAvailable: true };

    if (category && category !== "All") query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "popular") sortOption = { sold: -1 };

    const products = await Product.find(query)
      .populate("seller", "username name avatar isVerified accountType")
      .sort(sortOption)
      .limit(50);

    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "username name avatar isVerified accountType");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({ ...req.body, seller: req.user._id });
    const populated = await Product.findById(product._id)
      .populate("seller", "username name avatar isVerified accountType");
    res.status(201).json({ success: true, product: populated });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("seller", "username name avatar isVerified accountType");
    res.json({ success: true, product: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const likeProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    const liked = product.likes.includes(req.user._id);
    if (liked) product.likes.pull(req.user._id);
    else product.likes.push(req.user._id);
    await product.save();
    res.json({ success: true, liked: !liked });
  } catch (error) {
    next(error);
  }
};
