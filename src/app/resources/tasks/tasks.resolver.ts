import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { TaskStatus } from "src/app/common/enum/taskStatus.enum";
import { Task } from "src/app/database/models/tasks/task.model";
import { TasksService } from "./tasks.service";

@Resolver(() => Task)
export class TasksResolver {
  constructor(private tasksService: TasksService) {}

  @Mutation(() => Task)
  createTask(
    @Args('title') title: string,
    @Args('boardId') boardId: number,
  ) {
    return this.tasksService.create(title, boardId);
  }

  @Mutation(() => Boolean)
  async moveTask(
    @Args('taskId') taskId: number,
    @Args('status', { type: () => TaskStatus }) status: TaskStatus,
  ) {
    await this.tasksService.updateStatus(taskId, status);
    return true;
  }

  @Mutation(() => Boolean)
  async deleteTask(@Args('id') id: number) {
    await this.tasksService.remove(id);
    return true;
  }
}
