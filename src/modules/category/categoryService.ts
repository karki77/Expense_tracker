import { prisma } from '../../config/setup/dbSetup';
import { ICreateCategorySchema } from './validation';

class CategoryService {
  async createCategory(data: ICreateCategorySchema, userId: string) {
    // Check if category with same name exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        userId,
        name: data.name,
      },
    });

    if (existingCategory) {
      return {
        success: false,
        error: 'Category with this name already exists',
      };
    }

    // Create new category
    const newCategory = await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        userId,
      },
    });

    return {
      data: newCategory,
    };
  }
}

export default new CategoryService();

// return // throw

// #1
/**
 *
 * id ,
 * return
 * name = ram
 * console.log(ram);
 */

// ram

// #1: reason:

// #2
/**
 * id,
 * !id
 * throw (id is required)
 * name = shyam
 * console.log(name)
 */

// id is required

// #2 : reason : throw paxi jadaina.
