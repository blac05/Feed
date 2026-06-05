import Product from "../models/Product.js";

export const createProduct =
  data =>
    Product.create(data);

export const getProducts =
  () =>
    Product.find()
      .populate(
        "creator",
        "username avatar verified"
      )
      .sort({
        createdAt: -1,
      });

export const getProduct =
  id =>
    Product.findById(id)
      .populate(
        "creator",
        "username avatar verified"
      );
