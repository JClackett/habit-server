import { Connection } from "typeorm"
import { useContainer } from "type-graphql"
import faker from "faker"
import { Container } from "typedi"

import { graphqlCall } from "../../../testUtils/graphqlCall"
import { testConn } from "../../../testUtils/testConn"
import createUserSession from "../../../testUtils/createUserSession"

useContainer(Container)

let conn: Connection
beforeAll(async () => {
  conn = await testConn()
})
afterAll(async () => {
  await conn.close()
})

const getHabitsQuery = `
  query GetHabits {
    getHabits {
      id
      name
      color
      type
      amount
    }
  }
`

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

describe("Habit", () => {
  it("gets habits", async () => {
    const user = await createUserSession()

    await graphqlCall({
      source: createHabitMutation,
      variableValues: {
        data: {
          name: faker.name.title(),
          color: "123456",
          type: "body",
          amount: 4,
        },
      },
      userId: user.id,
    })
    await graphqlCall({
      source: createHabitMutation,
      variableValues: {
        data: {
          name: faker.name.title(),
          color: "123456",
          type: "body",
          amount: 4,
        },
      },
      userId: user.id,
    })

    const response = await graphqlCall({
      source: getHabitsQuery,
      userId: user.id,
    })

    expect(response.data!.getHabits.length).toBe(2)
  })
})
