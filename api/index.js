import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

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

app.get("/api/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.get("/api/product/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  res.json(product);
});

//get a user's cart items
app.get("/cart", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { products: true },
  });

  res.json(cart);
});

//add a new item to a user's cart
// app.post("/cart/products/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const { productId } = req.body;

//   const user = await prisma.user.findUnique({
//     where: {
//       id,
//     },
//   });
//   //console.log("User:", user);

//   const cart = await prisma.cart.findUnique({
//     where: { userId: user.id },
//     include: { products: true },
//   });

//   //console.log("Cart:", cart);

//   const product = await prisma.product.findUnique({
//     where: { id: parseInt(productId) },
//   });

//   const updatedCart = await prisma.cart.update({
//     where: { userId: user.id },
//     data: { products: { connect: { id: product.id } } },
//     include: { products: true },
//   });

//   res.json(updatedCart);
// });

// //remove an item from a user's cart
// app.delete("/cartItem/:id", async (req, res) => {
//   const userId = parseInt(req.params.id);
//   const { productId } = req.body;

//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   const cart = await prisma.cart.findUnique({
//     where: { userId: user.id },
//     include: { products: true },
//   });

//   const product = await prisma.product.findUnique({
//     where: { id: parseInt(productId) },
//   });

//   const updatedCart = await prisma.cart.update({
//     where: { userId: user.id },
//     data: { products: { disconnect: { id: product.id } } },
//     include: { products: true },
//   });

//   res.json(updatedCart);
// });

// verify user status, if not registered in our database we will create it
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

app.listen(8002, () => {
  console.log("Server running on http://localhost:8002 🎉 🚀");
});
