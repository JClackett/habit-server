import { graphql, GraphQLSchema } from "graphql"
import Maybe from "graphql/tsutils/Maybe"
import { createSchema } from "../config"

interface Options {
  source: string
  variableValues?: Maybe<{
    [key: string]: any
  }>
  userId?: number
}

let schema: GraphQLSchema

export const graphqlCall = async ({
  source,
  variableValues,
  userId,
}: Options) => {
  if (!schema) {
    schema = await createSchema()
  }
  return graphql({
    schema,
    source,
    variableValues,
    contextValue: {
      req: {
        session: {
          userId,
          destroy: (cb: Function) => cb(),
        },
      },
      res: {
        clearCookie: jest.fn(),
      },
    },
  })
}
