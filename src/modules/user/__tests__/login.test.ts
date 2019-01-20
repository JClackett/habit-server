import { Connection } from "typeorm"
import { useContainer } from "type-graphql"
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

const logoutMutation = `
  mutation Logout {
    logout
  }
`

describe("Login", () => {
  it("logs in a user then logs them out", async () => {
    const user = await createUserSession()

    expect(user).toMatchObject({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    })

    const logoutResponse = await graphqlCall({
      source: logoutMutation,
      userId: user.id,
    })

    expect(logoutResponse.data).toBeTruthy()
  })
})
