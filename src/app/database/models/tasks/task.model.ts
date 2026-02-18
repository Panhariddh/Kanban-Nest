import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Board } from '../boards/board.model';
import { TaskStatus } from 'src/app/common/enum/taskStatus.enum';


registerEnumType(TaskStatus, { name: 'TaskStatus' });

@ObjectType()
@Entity()
export class Task {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field(() => TaskStatus)
  @Column({ default: TaskStatus.TODO })
  status: TaskStatus;

  @ManyToOne(() => Board, board => board.tasks)
  @Field(() => Board)
  board: Board;
}
