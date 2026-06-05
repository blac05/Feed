import CreatorStore from "../models/CreatorStore.js";

export const createStore =
  async (req, res, next) => {
    try {
      const store =
        await CreatorStore.create({
          ...req.body,
          creator:
            req.user._id,
        });

      res.status(201).json({
        success: true,
        store,
      });
    } catch (error) {
      next(error);
    }
  };

export const getStore =
  async (req, res, next) => {
    try {
      const store =
        await CreatorStore.findById(
          req.params.id
        ).populate(
          "creator",
          "username avatar verified"
        );

      res.json({
        success: true,
        store,
      });
    } catch (error) {
      next(error);
    }
  };
