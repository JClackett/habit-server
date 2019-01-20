import { Resolver, Query, Mutation, Arg, Authorized, Ctx } from "type-graphql"

import { Habit } from "./habit.entity"
import { HabitService } from "./habit.service"
import { HabitData, UpdateHabit } from "./habit.inputs"
import { ResolverContext } from "../../lib/types"

@Resolver(() => Habit)
export class HabitResolver {
  constructor(private readonly habitService: HabitService) {}

  // GET HABBITS
  @Authorized()
  @Query(() => [Habit])
  async getHabits(@Ctx() { req: { user } }: ResolverContext): Promise<Habit[]> {
    const habits = await this.habitService.getAll(user)
    return habits
  }

  // CREATE HABBIT
  @Authorized()
  @Mutation(() => Habit)
  async createHabit(
    @Arg("data") data: HabitData,
    @Ctx() { req: { user } }: ResolverContext,
  ): Promise<Habit> {
    const habit = await this.habitService.create(user, data)
    return habit
  }

  // UPDATE HABBIT
  @Authorized()
  @Mutation(() => Habit)
  async updateHabit(@Arg("data") data: UpdateHabit): Promise<Habit> {
    const habit = await this.habitService.update(data)
    return habit
  }

  // DESTROY HABBIT
  @Authorized()
  @Mutation(() => Boolean)
  async destroyHabit(@Arg("habitId") habitId: string): Promise<boolean> {
    await this.habitService.destroy(habitId)
    return true
  }
}
