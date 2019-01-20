import { AuthChecker } from "type-graphql"
import { ResolverContext } from "../lib/types"
import { User } from "../modules/user/user.entity"

export const authChecker: AuthChecker<ResolverContext> = async ({
  context: { req },
}) => {
  if (req.session!.userId) {
    const user = await User.findOne(req.session!.userId)
    if (!user) throw new Error("user not found")
    req.user = user
    return true
  } else {
    return false
  }
}
