import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { ObjectType, Field, ID } from "type-graphql"
import { Habit } from "../habit/habit.entity"

@ObjectType()
@Entity()
export class Step extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Field()
  @Column()
  day: Date

  @ManyToOne(() => Habit, habit => habit.steps, { onDelete: "CASCADE" })
  habit: Habit

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}
