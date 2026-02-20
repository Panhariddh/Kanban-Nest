import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskStatus } from "src/app/common/enum/taskStatus.enum";
import { pubSub } from "src/app/common/pubsub";
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

    const savedTask = await this.repo.save(task);

    await pubSub.publish('taskUpdated', {
      taskUpdated: savedTask,
      boardId: boardId,
    });

    return savedTask;
    
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
    
    const updatedTask = await this.repo.save(task);

    await pubSub.publish('taskUpdated', {
      taskUpdated: updatedTask,
      boardId: task.board.id,
    });
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

    const boardId = task.board.id;

    await this.repo.delete(id);

    await pubSub.publish('taskUpdated', {
      taskUpdated: task,
      boardId: boardId,
    });
  }

  async update(
    id: number,
    title: string,
    description: string,
    userId: number,
  ) {
    const task = await this.repo.findOne({
      where: { id },
      relations: ['board', 'board.owner'],
    });

    if (!task) throw new Error("Task not found");
    if (task.board.owner.id !== userId) {
      throw new UnauthorizedException("Not your task");
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;

    const updatedTask = await this.repo.save(task);

    await pubSub.publish('taskUpdated', {
      taskUpdated: updatedTask,
      boardId: task.board.id,
    });

    return updatedTask;
  }
}
