import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Board } from "src/app/database/models/boards/board.model";
import { Repository } from "typeorm";

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private repo: Repository<Board>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['tasks', 'owner'] });
  }

  create(title: string) {
    const board = this.repo.create({ title });
    return this.repo.save(board);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
