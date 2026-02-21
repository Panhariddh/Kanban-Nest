import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/app/common/guards/gql-auth.guard';
import { CurrentUser } from 'src/app/common/decorators/user.decorator';
import { UserModel } from 'src/app/database/models/user.model';

@Resolver(() => UserModel)
export class UsersResolver {
  @UseGuards(GqlAuthGuard)
  @Query(() => UserModel)
  me(@CurrentUser() user: UserModel) {
    return user;
  }
}