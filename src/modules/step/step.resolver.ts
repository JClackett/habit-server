import {
  Resolver,
  Mutation,
  Arg,
  UseMiddleware,
  Authorized,
  Query,
} from "type-graphql"

import { Step } from "./step.entity"
import { StepService } from "./step.service"
import { CreateStepData } from "./step.inputs"

import { StepPolicyMiddleware } from "./step.middleware"

@Resolver(() => Step)
export class StepResolver {
  constructor(private readonly stepService: StepService) {}

  // GET TOTAL STEPS
  @Authorized()
  @Query(() => Number)
  @UseMiddleware(StepPolicyMiddleware)
  async getTotalSteps(
    @Arg("habitId") habitId: string,
    @Arg("startDate") startDate: string,
  ): Promise<number> {
    const count = await this.stepService.getTotal(habitId, startDate)
    return count
  }

  // CREATE STEP
  @Authorized()
  @Mutation(() => Step)
  @UseMiddleware(StepPolicyMiddleware)
  async createStep(@Arg("data") data: CreateStepData): Promise<Step> {
    const step = await this.stepService.create(data)
    return step
  }
}
