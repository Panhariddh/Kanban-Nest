import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Board } from "src/app/database/models/boards/board.model";
import { BoardsService } from "./boards.service";
import { UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "src/app/common/guards/gql-auth.guard";
import { CurrentUser } from "src/app/common/decorators/user.decorator";
import { UserModel } from "src/app/database/models/user.model";

@UseGuards(GqlAuthGuard)
@Resolver(() => Board)
export class BoardsResolver {
  constructor(private boardsService: BoardsService) {}

   @Query(() => [Board])
  boards(@CurrentUser() user: UserModel) {
    return this.boardsService.findAllByUser(user.id);
  }

  @Mutation(() => Board)
  createBoard(
    @Args('title') title: string,
    @CurrentUser() user: UserModel,
  ) {
    return this.boardsService.create(title, user);
  }

  @Mutation(() => Board)
  updateBoard(
    @Args('id') id: number,
    @Args('title') title: string,
    @CurrentUser() user: UserModel,
  ) {
    return this.boardsService.update(id, title, user.id);
  }

  @Mutation(() => Boolean)
  deleteBoard(
    @Args('id') id: number,
    @CurrentUser() user: UserModel,
  ) {
    return this.boardsService.remove(id, user.id);
  }
}
