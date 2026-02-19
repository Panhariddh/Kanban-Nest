import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Board } from "src/app/database/models/boards/board.model";
import { UserModel } from "src/app/database/models/user.model";
import { Repository } from "typeorm";

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private repo: Repository<Board>,
  ) {}

  async findAllByUser(userId: number) {
    return this.repo.find({
      where: {
        owner: { id: userId },
      },
      relations: ['tasks'],
    });
  }

  async create(title: string, user: UserModel) {
    const board = this.repo.create({
      title,
      owner: user,
    });

    return this.repo.save(board);
  }

  async remove(id: number, userId: number) {
    const board = await this.repo.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!board || board.owner.id !== userId) {
      throw new Error('Unauthorized');
    }

    await this.repo.delete(id);
    return true;
  }

}
