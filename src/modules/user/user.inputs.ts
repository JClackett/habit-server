import { InputType, Field } from "type-graphql"
import { User } from "./user.entity"
import { MinLength } from "class-validator"

@InputType()
export class RegisterData implements Partial<User> {
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  @MinLength(8)
  email: string

  @Field()
  @MinLength(8)
  password: string
}

@InputType()
export class LoginData implements Partial<User> {
  @Field()
  email: string

  @Field()
  password: string
}

@InputType()
export class UserData implements Partial<User> {
  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field()
  email: string
}
