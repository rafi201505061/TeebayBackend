import { DatabaseService } from 'src/database/database.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
  constructor(private readonly databaseService: DatabaseService) {}
  findAll() {
    return this.databaseService.category.findMany();
  }
}
