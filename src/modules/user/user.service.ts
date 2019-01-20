import { User } from "./user.entity"
import bcrypt from "bcryptjs"
import { RegisterData, LoginData, UserData } from "./user.inputs"

export class UserService {
  async create(data: RegisterData): Promise<User> {
    const { email, password, firstName, lastName } = data
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    }).save()
    return user
  }

  async find(userId: string): Promise<User> {
    const user = await User.findOne({ where: { id: userId } })
    if (!user) throw new Error("Not found")
    return user
  }

  async login(data: LoginData): Promise<User> {
    const { email, password } = data
    const user = await User.findOne({ where: { email } })
    if (!user) throw new Error("incorrect email or password")
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) throw new Error("incorrect email or password")
    return user
  }

  async update(userId: string, data: UserData): Promise<User> {
    const user = await User.findOne(userId)
    if (!user) throw new Error("incorrect email or password")
    Object.assign(user, data)
    await user.save()
    return user
  }
}
