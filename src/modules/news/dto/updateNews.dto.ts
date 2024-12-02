import { PartialType } from "@nestjs/swagger";
import { CreateNewsDto } from "./createNews.dto";

export class UpdateNewsDto extends PartialType(CreateNewsDto) {}    