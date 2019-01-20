import dayjs from "dayjs"
import { Between } from "typeorm"

import { Step } from "./step.entity"
import { CreateStepData } from "./step.inputs"
import { Habit } from "../habit/habit.entity"

export class StepService {
  async create(data: CreateStepData): Promise<Step> {
    const habit = await Habit.findOne(data.habitId)
    const step = await Step.create({ day: data.day, habit }).save()
    return step
  }

  async getTotal(habitId: string, startDate: string): Promise<number> {
    const habit = await Habit.findOne(habitId)
    // dayjs' weeks start on sunday.. no current way to configure
    const startOfInterval = dayjs(startDate)
      .subtract(1, "day")
      .startOf("week")
      .add(1, "day")

    const endOfInterval = dayjs(startDate)
      .subtract(1, "day")
      .endOf("week")
      .add(1, "day")

    const count = await Step.getRepository().count({
      habit,
      day: Between(startOfInterval, endOfInterval),
    })
    return count
  }
}
