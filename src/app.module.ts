import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './app/config/config.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './app/resources/users/users.module';
import { TasksModule } from './app/resources/tasks/tasks.module';
import { BoardsModule } from './app/resources/boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './app/database/models/user.model';
import { Board } from './app/database/models/boards/board.model';
import { Task } from './app/database/models/tasks/task.model';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),

    TypeOrmModule.forFeature([UserModel, Board, Task]),

    ConfigModule,
    UsersModule,
    BoardsModule,
    TasksModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
