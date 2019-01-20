import { User } from "../modules/user/user.entity"
import faker = require("faker")
import { graphqlCall } from "./graphqlCall"

const loginMutation = `
  mutation Login($data: LoginData!) {
    login(
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

export default async () => {
  const password = faker.internet.password()

  const user = await User.create({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password,
  }).save()

  const loginResponse = await graphqlCall({
    source: loginMutation,
    variableValues: {
      data: {
        email: user.email,
        password,
      },
    },
  })

  return loginResponse.data!.login
}
