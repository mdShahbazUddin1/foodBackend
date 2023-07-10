
const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const { restaurantRouter } = require("./routes/restaurant.routes");
const { orderRouter } = require("./routes/order.routes");
require("dotenv").config()


const app = express();

app.use(express.json());

app.use("/api",userRouter)
app.use("/api",restaurantRouter)
app.use("/api",orderRouter)

app.listen(process.env.PORT, async()=>{
try {
    await connection
    console.log("db is connected")
} catch (error) {
    
}
    console.log("server is running")
})