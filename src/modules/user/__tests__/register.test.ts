import { Connection } from "typeorm"

import { useContainer } from "type-graphql"
import { Container } from "typedi"
import faker from "faker"

import { graphqlCall } from "../../../testUtils/graphqlCall"
import { User } from "../user.entity"
import { testConn } from "../../../testUtils/testConn"

useContainer(Container)

let conn: Connection
beforeAll(async () => {
  conn = await testConn()
})
afterAll(async () => {
  await conn.close()
})

const registerMutation = `
  mutation Register($data: RegisterData!) {
    register(
      data: $data
    ) {
      id
      firstName
      lastName
      email
      name
    }
  }
`

describe("Register", () => {
  it("creates a user", async () => {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    const response = await graphqlCall({
      source: registerMutation,
      variableValues: {
        data: user,
      },
    })

    expect(response).toMatchObject({
      data: {
        register: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    })

    const dbUser = await User.findOne({ where: { email: user.email } })
    expect(dbUser).toBeDefined()
    expect(dbUser!.firstName).toBe(user.firstName)
  })
})
