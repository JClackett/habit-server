import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm"
import bcrypt from "bcryptjs"
import { ObjectType, Field, ID } from "type-graphql"
import { Habit } from "../habit/habit.entity"

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Field()
  @Column()
  firstName: string

  @Field()
  @Column()
  lastName: string

  @Field()
  @Column("text", { unique: true })
  email: string

  @Field({ description: "first and last name combined" })
  name: string

  @Column()
  password: string

  @OneToMany(() => Habit, habit => habit.user)
  habits: Habit[]

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12)
  }
}
