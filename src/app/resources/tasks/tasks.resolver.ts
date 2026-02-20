import { Args, Mutation, Resolver, Subscription } from "@nestjs/graphql";
import { TaskStatus } from "src/app/common/enum/taskStatus.enum";
import { Task } from "src/app/database/models/tasks/task.model";
import { TasksService } from "./tasks.service";
import { CurrentUser } from "src/app/common/decorators/user.decorator";
import { UserModel } from "src/app/database/models/user.model";
import { GqlAuthGuard } from "src/app/common/guards/gql-auth.guard";
import { UseGuards } from "@nestjs/common";
import { pubSub } from "src/app/common/pubsub";

@Resolver(() => Task)
export class TasksResolver {
  constructor(private tasksService: TasksService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Task)
  createTask(
    @Args('title') title: string,
    @Args('boardId') boardId: number,
    @CurrentUser() user: UserModel,
  ) {
    return this.tasksService.create(title, boardId, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async moveTask(
    @Args('taskId') taskId: number,
    @Args('status', { type: () => TaskStatus }) status: TaskStatus,
    @CurrentUser() user: UserModel,
  ) {
    await this.tasksService.updateStatus(taskId, status, user.id);
    return true;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Task)
  updateTask(
    @Args('id') id: number,
    @Args('title', { nullable: true }) title: string,
    @Args('description', { nullable: true }) description: string,
    @CurrentUser() user: UserModel,
  ) {
    return this.tasksService.update(id, title, description, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteTask(
    @Args('id') id: number,
    @CurrentUser() user: UserModel,
  ) {
    await this.tasksService.remove(id, user.id);
    return true;
  }

  @Subscription(() => Task, {
    filter: (payload, variables) =>
      payload.boardId === variables.boardId,
  })
  taskUpdated(@Args('boardId') boardId: number) {
    return pubSub.asyncIterator(['taskUpdated']);
  }


}
