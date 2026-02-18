import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserModel } from '../user.model';
import { Task } from '../tasks/task.model';


@ObjectType()
@Entity()
export class Board {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @ManyToOne(() => UserModel, user => user.boards)
  @Field(() => UserModel)
  owner: UserModel;

  @OneToMany(() => Task, task => task.board)
  @Field(() => [Task], { nullable: true })
  tasks: Task[];
}
