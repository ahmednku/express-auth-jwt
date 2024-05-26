import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const add = async (req, res) => {
  const { product } = req.body;
  await prisma.product.create({
    data: {
      ...product,
    },
  });
  return res.status(200).json({ product });
};

const update = async (req, res) => {
  const { product } = req.body;
  const { id } = req.params;
  if (!id || !product) {
    return res.status(400).json({ message: `invalid request` });
  }
  const exists = await prisma.product.findFirst({ where: { id: +id } });
  if (!exists) {
    return res.status(400).json({ message: `no product found with id ${id}` });
  }
  const updated = await prisma.product.update({
    where: { id: +id },
    data: {
      ...product,
    },
  });
  return res.status(200).json({ message: "product updated", product: updated });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!(await prisma.product.findFirst({ where: { id: +id } }))) {
    return res.status(400).json({ message: `no product found with id ${id}` });
  }
  const deleted = await prisma.product.delete({ where: { id: +id } });
  return res.status(200).json({ message: `product deleted ${id}` });
};

const getProducts = async (req, res) => {
  const products = await prisma.product.findMany();
  return res.status(200).json({ message: "products", products });
};

const getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findFirst({ where: { id: +id } });
  if (!product) {
    return res.status(400).json({ message: `no product found with id ${id}` });
  }
  return res.status(200).json({ message: `product ${id}` });
};

export { add, deleteProduct, getProduct, getProducts, update };
