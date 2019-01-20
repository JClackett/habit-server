import { InputType, Field } from "type-graphql"
import { Habit } from "./habit.entity"

@InputType()
export class HabitData implements Partial<Habit> {
  @Field()
  name: string

  @Field()
  color: string

  @Field()
  type: string

  @Field()
  amount: number
}

@InputType()
export class UpdateHabit extends HabitData {
  @Field()
  id: string
}
