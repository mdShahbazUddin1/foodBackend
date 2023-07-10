const express = require("express");
const { RestaurantModel } = require("../models/restaurant.model");

const restaurantRouter = express.Router();


restaurantRouter.post("/restaurants", async (req, res) => {
  try {
    const {name,address,menu} = req.body;
    const restaunrant = new RestaurantModel({name,address,menu});
    await restaunrant.save()
    res.status(200).send({msg:"restaurant added",restaunrant});
  } catch (error) {
    res.status(400).send(error);
  }
});


restaurantRouter.get("/restaurants",async(req,res)=>{
    try {
        const restaunrant = await RestaurantModel.find();
        res.status(200).send(restaunrant);
    } catch (error) {
        res.status(400).send(error);
    }
});

restaurantRouter.get("/restaurants/:id",async(req,res)=>{
    try {
        const {id} = req.params;
        const restaurant = await RestaurantModel.findById(id);
        res.status(200).send(restaurant)
    } catch (error) {
          res.status(400).send(error);
    }
});

restaurantRouter.get("/restaurants/:id/menu", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await RestaurantModel.findById(id);
    res.status(200).send(restaurant.menu);
  } catch (error) {
    res.status(400).send({msg:error});
  }
});


restaurantRouter.post("/restaurants/:id/menu", async (req, res) => {
  try {
    const { id } = req.params;
    const {name,description,price,image} = req.body
    const restaurant = await RestaurantModel.findById(id);
    if(!restaurant){
        return res.status(404).send({msg:"restaurant not found !"})
    }

    const newItem = {
        name,
        description,
        price,
        image
    }
    restaurant.menu.push(newItem)
    await restaurant.save()
    res.status(200).send({ msg: "item added", newItem });
  } catch (error) {
    res.status(400).send({ msg: error });
  }
});

restaurantRouter.delete(
  "/restaurants/:restId/menu/:itemId",
  async (req, res) => {
    try {
      const { restId, itemId } = req.params;
      const { name, description, price, image } = req.body;
      const restaurant = await RestaurantModel.findById(restId);
      if (!restaurant) {
        return res.status(404).send({ msg: "restaurant not found !" });
      }

      const item = restaurant.menu.findIndex(
        (item) => item._id.toString() === itemId
      );

      if (item === -1) {
        return res.status(404).send({ msg: "menu item not found" });
      }
      restaurant.menu.splice(item,1);
      await restaurant.save()
      res.status(202).send({ msg: "item deleted" });
    } catch (error) {
      res.status(400).send({ msg: error });
    }
  }
);

module.exports={restaurantRouter}