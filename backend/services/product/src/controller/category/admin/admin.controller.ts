import type { Request, Response } from "express";
import mongoose from "mongoose";
import CategoryModel from "../../../model/category.js";
import { generateSlug } from "../../../util/generateSlug.js";
import { invalidateCategoryCache } from "../../../helper/invalidateProductCache.js";

export const createCategory = async (req: Request, res: Response) => {
  const {
    name,
    description,
    parent,
    isActive = true,
    sortOrder = 0,
    metaTitle,
    metaDescription
  } = req.body;

  const { userId } = req.user;
  const slug = generateSlug(name);

  const exists = await CategoryModel.findOne({ slug });
  if (exists) {
    return res.status(409).json({
      success: false,
      message: "Category already exists"
    });
  }

  let level = 0;
  if (parent) {
    const parentCategory = await CategoryModel.findById(parent);
    if (!parentCategory) {
      return res.status(404).json({
        success: false,
        message: "Parent category not found"
      });
    }
    level = parentCategory.level + 1;
  }

  const category = await CategoryModel.create({
    name,
    slug,
    description,
    parent: parent || null,
    level,
    isActive,
    sortOrder:Number(sortOrder),
    metaTitle,
    metaDescription,
    createdBy: userId
  });

  await invalidateCategoryCache();

  return res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category
  });
};


export const updateCategory = async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const updates = req.body;
    const { userId } = req.user as { userId: string };

    if (!mongoose.Types.ObjectId.isValid(categoryId as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await CategoryModel.findOne({
      _id: new mongoose.Types.ObjectId(categoryId as string),
      isDeleted: false,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (updates.name && updates.name !== category.name) {
      updates.slug = generateSlug(updates.name);
    }

    updates.updatedBy = userId;

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      updates,
      { new: true }
    );

    await invalidateCategoryCache(categoryId as string);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { userId } = req.user;

  if (!mongoose.Types.ObjectId.isValid(categoryId as string)) {
    return res.status(400).json({
      success: false,
      message: "Invalid category ID"
    });
  }

  const category = await CategoryModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(categoryId as string), isDeleted: false },
    {
      isDeleted: true,
      isActive: false,
      updatedBy: userId,
    },
    { new: true }
  );

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found"
    });
  }

  await invalidateCategoryCache(categoryId as string);

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
};