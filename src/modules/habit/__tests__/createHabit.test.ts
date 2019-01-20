import { Connection } from "typeorm"

import { useContainer } from "type-graphql"
import { Container } from "typedi"
import faker from "faker"

import { graphqlCall } from "../../../testUtils/graphqlCall"
import { testConn } from "../../../testUtils/testConn"
import { Habit } from "../habit.entity"
import createUserSession from "../../../testUtils/createUserSession"

useContainer(Container)

let conn: Connection
beforeAll(async () => {
  conn = await testConn()
})
afterAll(async () => {
  await conn.close()
})

const createHabitMutation = `
  mutation CreateHabit($data: HabitData!) {
    createHabit(
      data: $data
    ) {
      id
      name
      amount
      type
      color
    }
  }
`

describe("Habit", async () => {
  it("creates a habit", async () => {
    const user = await createUserSession()

    const habit = {
      name: faker.lorem.word(),
      type: "body",
      color: "#123456",
      amount: 5,
    }

    const createHabitRes = await graphqlCall({
      source: createHabitMutation,
      variableValues: {
        data: habit,
      },
      userId: user.id,
    })

    expect(createHabitRes.data!.createHabit.id).toBeDefined()
    expect(createHabitRes).toMatchObject({
      data: {
        createHabit: {
          name: habit.name,
          type: habit.type,
          color: habit.color,
          amount: habit.amount,
        },
      },
    })

    const dbHabit = await Habit.findOne(createHabitRes.data!.createHabit.id)
    expect(dbHabit).toBeDefined()
    expect(dbHabit!.name).toBe(habit.name)
  })
})
