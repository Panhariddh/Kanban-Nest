import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { TaskStatus } from "src/app/common/enum/taskStatus.enum";
import { Task } from "src/app/database/models/tasks/task.model";
import { TasksService } from "./tasks.service";
import { CurrentUser } from "src/app/common/decorators/user.decorator";
import { UserModel } from "src/app/database/models/user.model";
import { GqlAuthGuard } from "src/app/common/guards/gql-auth.guard";
import { UseGuards } from "@nestjs/common";

@UseGuards(GqlAuthGuard)
@Resolver(() => Task)
export class TasksResolver {
  constructor(private tasksService: TasksService) {}

  @Mutation(() => Task)
  createTask(
    @Args('title') title: string,
    @Args('boardId') boardId: number,
    @CurrentUser() user: UserModel,
  ) {
    return this.tasksService.create(title, boardId, user.id);
  }

  @Mutation(() => Boolean)
  async moveTask(
    @Args('taskId') taskId: number,
    @Args('status', { type: () => TaskStatus }) status: TaskStatus,
    @CurrentUser() user: UserModel,
  ) {
    await this.tasksService.updateStatus(taskId, status, user.id);
    return true;
  }

  @Mutation(() => Boolean)
  async deleteTask(
    @Args('id') id: number,
    @CurrentUser() user: UserModel,
  ) {
    await this.tasksService.remove(id, user.id);
    return true;
  }
}
