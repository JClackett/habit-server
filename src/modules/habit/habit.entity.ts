import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm"
import { ObjectType, Field, ID, Int } from "type-graphql"
import { User } from "../user/user.entity"
import { Step } from "../step/step.entity"

@ObjectType()
@Entity()
export class Habit extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Field()
  @Column()
  name: string

  @Field()
  @Column("enum", { enum: ["mind", "body", "soul"] })
  type: string

  @Field(() => Int)
  @Column()
  amount: number

  @Field()
  @Column()
  color: string

  @ManyToOne(() => User, user => user.habits)
  user: User

  @OneToMany(() => Step, steps => steps.habit)
  steps: Step[]

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}
