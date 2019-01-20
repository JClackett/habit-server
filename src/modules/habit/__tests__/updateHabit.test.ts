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

const updateHabitMutation = `
  mutation UpdateHabit($data: UpdateHabit!) {
    updateHabit(
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
  it("updates a habit", async () => {
    const user = await createUserSession()

    const habit = await Habit.create({
      name: faker.lorem.word(),
      type: "body",
      color: "#123456",
      amount: 5,
    }).save()

    const updateHabitRes = await graphqlCall({
      source: updateHabitMutation,
      variableValues: {
        data: {
          id: habit.id,
          amount: 7,
          name: habit.name,
          color: habit.color,
          type: habit.type,
        },
      },
      userId: user.id,
    })

    expect(updateHabitRes).toMatchObject({
      data: {
        updateHabit: {
          name: habit.name,
          amount: 7,
        },
      },
    })
  })
})
