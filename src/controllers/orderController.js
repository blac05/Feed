import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const createOrder =
  async (req, res, next) => {
    try {
      const product =
        await Product.findById(
          req.body.productId
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found",
        });
      }

      const order =
        await Order.create({
          buyer: req.user._id,
          product:
            product._id,
          amount:
            product.price,
        });

      res.status(201).json({
        success: true,
        order,
      });
    } catch (error) {
      next(error);
    }
  };

export const getMyOrders =
  async (req, res, next) => {
    try {
      const orders =
        await Order.find({
          buyer:
            req.user._id,
        }).populate(
          "product"
        );

      res.json({
        success: true,
        orders,
      });
    } catch (error) {
      next(error);
    }
  };
