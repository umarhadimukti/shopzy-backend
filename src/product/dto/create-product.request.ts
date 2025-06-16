import { IsString, IsNotEmpty, IsDecimal } from 'class-validator';

export class CreateProductRequest {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    description: string;
    @IsDecimal()
    @IsNotEmpty()
    price: number;
}