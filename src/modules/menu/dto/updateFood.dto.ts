import { PartialType } from "@nestjs/swagger";
import { CreateNewFoodDto } from "./createNewFood.dto";

export class FoodUpdateDto extends PartialType(CreateNewFoodDto) {}