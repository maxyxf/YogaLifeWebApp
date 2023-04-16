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
app.post("/cart/product/:productId", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { productId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { products: true },
    });
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    const updatedCart = await prisma.cart.update({
      where: { userId: user.id },
      data: { products: { connect: { id: product.id } } },
      include: { products: true },
    });

    const newCartItem = await prisma.cartItem.create({
      data: {
        quantity: 1,
        product: { connect: { id: product.id } },
        cart: { connect: { id: cart.id } },
      },
    });

    res.json(updatedCart);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding product to cart");
  }
});

// Update the quantity of the cart item
app.put("/cart/item/:itemId", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { itemId } = req.params;
  const { quantity } = req.body;

  const user = await prisma.user.findUnique({
    where: { auth0Id },
  });

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: parseInt(itemId) },
    include: {
      product: true,
      cart: {
        include: { products: true },
      },
    },
  });

  if (!cartItem) {
    return res.status(404).json({ message: "CartItem not found" });
  }

  if (cartItem.cart.userId !== user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const updatedCartItem = await prisma.cartItem.update({
    where: { id: parseInt(itemId) },
    data: { quantity: parseInt(quantity) },
    include: {
      product: true,
      cart: {
        include: { products: true },
      },
    },
  });

  res.json(updatedCartItem);
});

//delete an item in a user's cart
app.delete("/cart/product/:productId", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const { productId } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { products: true },
  });

  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const updatedCart = await prisma.cart.update({
    where: { userId: user.id },
    data: {
      products: { disconnect: { id: product.id } },
      cartProduct: { deleteMany: { productId: product.id } },
    },
    include: { products: true },
  });

  res.json(updatedCart);
});

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
