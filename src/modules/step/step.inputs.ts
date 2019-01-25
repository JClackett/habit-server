import { InputType, Field } from "type-graphql"
import { Step } from "./step.entity"

@InputType()
export class StepData implements Partial<Step> {
  @Field()
  day: Date

  @Field()
  habitId: string
}
