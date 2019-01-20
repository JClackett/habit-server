import { Habit } from "./habit.entity"
import { User } from "../user/user.entity"
import { HabitData, UpdateHabit } from "./habit.inputs"

export class HabitService {
  async getAll(user: User): Promise<Habit[]> {
    const habits = await Habit.find({ user })
    return habits
  }

  async create(user: User, data: HabitData): Promise<Habit> {
    const habit = await Habit.create({
      ...data,
      user,
    }).save()
    return habit
  }

  async update(data: UpdateHabit): Promise<Habit> {
    let habit = await Habit.findOne(data.id)
    if (!habit) throw new Error("no habit found")
    Object.assign(habit, data)
    await habit.save()
    return habit
  }
}
