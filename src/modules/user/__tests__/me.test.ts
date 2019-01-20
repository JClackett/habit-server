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

const meQuery = `
  query Me {
    me {
      id
      firstName
      lastName
      email
      name
    }
  }
`

describe("Me", () => {
  it("gets user when logged in", async () => {
    const user = await createUserSession()

    const response = await graphqlCall({
      source: meQuery,
      userId: user.id,
    })

    expect(response).toMatchObject({
      data: {
        me: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
    })
  })

  it("fails when user is logged out", async () => {
    const response = await graphqlCall({
      source: meQuery,
    })
    expect(response.errors![0].message).toContain("Access denied!")
  })
})
