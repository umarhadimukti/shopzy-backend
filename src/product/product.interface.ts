import { Product } from '@prisma/client';

export interface ProductResponse extends Product {
  imageExists: boolean;
}
