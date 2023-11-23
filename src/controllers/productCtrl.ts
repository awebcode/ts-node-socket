import { Request, Response } from "express";
import ProductModel, { IProduct } from "../models/productModel.ts";

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, subcategory }: IProduct = req.body;

    const newProduct: IProduct = new ProductModel({
      name,
      description,
      price,
      category,
      subcategory,
      // Assign other fields here...
    });

    const savedProduct: IProduct = await newProduct.save();

    res.status(201).json({ message: "New Product added!", savedProduct });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    let query: any = {};

    if (req.query.search) {
      query = {
        $or: [
          { name: { $regex: req.query.search as string, $options: "i" } },
          { description: { $regex: req.query.search as string, $options: "i" } },
        ],
      };
    }

   if (req.query.category) {
     query.category = { $regex: req.query.category as string, $options: "i" };
   }
   if (req.query.subcategory) {
     query.subcategory = { $regex: req.query.subcategory as string, $options: "i" };
   }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseFloat(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseFloat(req.query.maxPrice as string);
      }
    }

    const products: IProduct[] = await ProductModel.find(query).lean();

    if (
      req.query.sortBy &&
      ["name", "price"].includes(req.query.sortBy as keyof IProduct)
    ) {
      const sortBy: keyof IProduct = req.query.sortBy as keyof IProduct;
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
      products.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 * sortOrder : 1 * sortOrder));
    } else {
      // Handle incorrect sortBy field or add a default sorting logic
      // For example, you might want to sort by 'createdAt' as default:
      products.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
    }

    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedResults: IPaginatedResults = {
      results: products.slice(startIndex, endIndex),
    };

    if (endIndex < products.length) {
      paginatedResults["next"] = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      paginatedResults["previous"] = {
        page: page - 1,
        limit: limit,
      };
    }

    res.json({count:paginatedResults.results.length,paginatedResults});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
interface IPaginatedResults {
  results: IProduct[];
  next?: {
    page: number;
    limit: number;
  };
  previous?: {
    page: number;
    limit: number;
  };
}
