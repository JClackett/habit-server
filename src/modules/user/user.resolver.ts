import {
  Resolver,
  Query,
  Mutation,
  Arg,
  FieldResolver,
  Root,
  Authorized,
  Ctx,
} from "type-graphql"
import { User } from "./user.entity"
import { UserData, LoginData, RegisterData } from "./user.inputs"
import { UserService } from "./user.service"
import { ResolverContext } from "../../lib/types"

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // ME
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: ResolverContext): Promise<User | null> {
    if (!req.session!.userId) return null
    return await this.userService.find(req.session!.userId)
  }

  // REGISTER
  @Mutation(() => User)
  async register(
    @Arg("data") data: RegisterData,
    @Ctx() ctx: ResolverContext,
  ): Promise<User> {
    const user = await this.userService.create(data)
    ctx.req.session!.userId = user.id
    return user
  }

  // LOGIN
  @Mutation(() => User)
  async login(
    @Arg("data") data: LoginData,
    @Ctx() ctx: ResolverContext,
  ): Promise<User> {
    const user = await this.userService.login(data)
    ctx.req.session!.userId = user.id
    return user
  }

  // UPDATE USER
  @Mutation(() => User)
  async updateUser(
    @Arg("data") data: UserData,
    @Ctx() ctx: ResolverContext,
  ): Promise<User> {
    const user = await this.userService.update(ctx.req.session!.userId, data)
    return user
  }

  // LOGOUT
  @Authorized()
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: ResolverContext): Promise<boolean> {
    await new Promise(res => ctx.req.session!.destroy(() => res()))
    ctx.res.clearCookie("habit.cookie")
    return true
  }

  @FieldResolver()
  async name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`
  }
}
