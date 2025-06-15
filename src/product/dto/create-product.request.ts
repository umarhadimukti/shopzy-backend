import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProductRequest {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    description: string;
    @IsNumber()
    @IsNotEmpty()
    price: number;
}