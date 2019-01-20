import { MiddlewareFn } from "type-graphql"
import { ResolverContext } from "../../lib/types"
import { Habit } from "../habit/habit.entity"

export const StepPolicyMiddleware: MiddlewareFn<ResolverContext> = async (
  { context, args },
  next,
) => {
  const userId = context.req.session!.userId
  const habit = await Habit.findOne(args.habitId, { relations: ["user"] })
  if (!habit || habit.user.id! !== userId) {
    throw new Error("Unauthorized step creation")
  }
  return next()
}
