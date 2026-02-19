import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskStatus } from "src/app/common/enum/taskStatus.enum";
import { Board } from "src/app/database/models/boards/board.model";
import { Task } from "src/app/database/models/tasks/task.model";
import { Repository } from "typeorm";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private repo: Repository<Task>,
    @InjectRepository(Board)
    private boardRepo: Repository<Board>,
  ) {}

  async create(title: string, boardId: number, userId: number) {
    const board = await this.boardRepo.findOne({
      where: { id: boardId },
      relations: ['owner'],
    });

    if (!board) {
      throw new Error("Board not found");
    }

    if (board.owner.id !== userId) {
      throw new UnauthorizedException("Not your board");
    }

    const task = this.repo.create({
      title,
      board,
    });

    return this.repo.save(task);
  }

  async updateStatus(id: number, status: TaskStatus, userId: number) {
    const task = await this.repo.findOne({
      where: { id },
      relations: ['board', 'board.owner'],
    });

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.board.owner.id !== userId) {
      throw new UnauthorizedException("Not your task");
    }

    task.status = status;
    await this.repo.save(task);
  }

  async remove(id: number, userId: number) {
    const task = await this.repo.findOne({
      where: { id },
      relations: ['board', 'board.owner'],
    });

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.board.owner.id !== userId) {
      throw new UnauthorizedException("Not your task");
    }

    await this.repo.delete(id);
  }
}
