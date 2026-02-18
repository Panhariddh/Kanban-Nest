import { Injectable } from "@nestjs/common";
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

  async create(title: string, boardId: number) {
    const board = await this.boardRepo.findOneBy({ id: boardId });

    if (!board) {
      throw new Error("Board not found");
    }

    const task = this.repo.create({
      title,
      board,
    });

    return this.repo.save(task);
  }

  updateStatus(id: number, status: TaskStatus) {
    return this.repo.update(id, { status });
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}
