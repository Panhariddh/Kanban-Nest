import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/app/database/models/tasks/task.model';
import { Board } from 'src/app/database/models/boards/board.model';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Board])],
  providers: [TasksService, TasksResolver]
})
export class TasksModule {}
