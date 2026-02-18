import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Board } from "src/app/database/models/boards/board.model";
import { BoardsService } from "./boards.service";

@Resolver(() => Board)
export class BoardsResolver {
  constructor(private boardsService: BoardsService) {}

  @Query(() => String)
  hello() {
    return "GraphQL working";
  }

  @Query(() => [Board])
  boards() {
    return this.boardsService.findAll();
  }

  @Mutation(() => Board)
  createBoard(@Args('title') title: string) {
    return this.boardsService.create(title);
  }
}
