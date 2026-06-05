import Product from "../models/Product.js";

export const createProduct =
  async (req, res, next) => {
    try {
      const product =
        await Product.create({
          ...req.body,
          creator:
            req.user._id,
        });

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      next(error);
    }
  };

export const getProducts =
  async (req, res, next) => {
    try {
      const products =
        await Product.find()
          .populate(
            "creator",
            "username avatar"
          );

      res.json({
        success: true,
        products,
      });
    } catch (error) {
      next(error);
    }
  };
