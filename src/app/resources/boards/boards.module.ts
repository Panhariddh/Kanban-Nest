import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsResolver } from './boards.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from 'src/app/database/models/boards/board.model';

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  providers: [BoardsService, BoardsResolver]
})
export class BoardsModule {}
