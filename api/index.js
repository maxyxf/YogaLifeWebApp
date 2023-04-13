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
// app.get("/cart", requireAuth, async (req, res) => {
//   const auth0Id = req.auth.payload.sub;

//   const user = await prisma.user.findUnique({
//     where: {
//       auth0Id,
//     },
//   });

//   const cart = await prisma.cart.findUnique({
//     where: {
//       authorId: user.id,
//     },
//   });

//   res.json(cart);
// });

app.get("/cart/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  const cart = await prisma.cart.findMany({
    where: { userId: user.id },
    include: { products: true },
  });

  res.json(cart);
});

app.listen(8002, () => {
  console.log("Server running on http://localhost:8002 🎉 🚀");
});
