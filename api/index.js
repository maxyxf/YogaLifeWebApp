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
    include: { products: true, cartProduct: true },
  });

  res.json(cart);
});

//add a new item to a user's cart
app.post("/cart/product/:productId", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { productId } = req.params;
  const { quantity } = req.body; // Get the quantity from the request body

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

    // Check if the product is already in the cart
    const productInCart = cart.products.find((p) => p.id === product.id);

    if (productInCart) {
      // If the product is already in the cart, update the quantity of the cartItem
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          productId: parseInt(productId),
          cart: {
            userId: user.id,
          },
        },
        include: {
          product: true,
          cart: {
            include: { products: true },
          },
        },
      });

      const updatedCartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: parseInt(quantity),
        },
      });

      // Return the updated cart
      const updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { products: true },
      });
      res.json(updatedCart);
    } else {
      // If the product is not in the cart, add it to the cart and create a new cartItem
      const updatedCart = await prisma.cart.update({
        where: { userId: user.id },
        data: { products: { connect: { id: product.id } } },
        include: { products: true },
      });

      const newCartItem = await prisma.cartItem.create({
        data: {
          quantity: parseInt(quantity), // Set the quantity to the value from the request body
          product: { connect: { id: product.id } },
          cart: { connect: { id: updatedCart.id } },
        },
      });

      // Return the updated cart
      const finalCart = await prisma.cart.findUnique({
        where: { id: updatedCart.id },
        include: { products: true },
      });
      res.json(finalCart);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding product to cart");
  }
});

// Update the quantity of the cart item
app.put("/cart/item/:productId", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { productId } = req.params;
  const { quantity } = req.body;

  const user = await prisma.user.findUnique({
    where: { auth0Id },
  });

  const cartItem = await prisma.cartItem.findFirst({
    where: {
      productId: parseInt(productId),
      cart: {
        userId: user.id,
      },
    },
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

  const updatedCartItem = await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity: parseInt(quantity) },
    include: {
      product: true,
      cart: {
        include: { products: true },
      },
    },
  });

  const updatedCart = await prisma.cart.findUnique({
    where: { id: updatedCartItem.cartId },
    include: { products: true, cartProduct: true },
  });

  res.json(updatedCart);
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
    include: { products: true, cartProduct: true },
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
