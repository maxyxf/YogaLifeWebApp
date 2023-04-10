import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import products from "./products.js";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

app.get("/ping", (req, res) => {
  res.send("pong");
});

// app.get("/api/products", (req, res) => {
//   res.json(products);
// });

app.get("/api/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
  console.log(products);
});

app.get("/api/product/:id", (req, res) => {
  const product = products.find(
    (product) => product.id === parseInt(req.params.id)
  );
  //console.log(product);
  res.json(product);
});

app.listen(8002, () => {
  console.log("Server running on http://localhost:8002 🎉 🚀");
});
