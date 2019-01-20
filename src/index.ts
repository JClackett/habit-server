import "reflect-metadata"
import "dotenv/config"
import { ApolloServer } from "apollo-server-express"
import express, { Request, Response } from "express"
import session from "express-session"
import morgan from "morgan"
import { useContainer, formatArgumentValidationError } from "type-graphql"
import { Container } from "typedi"

import createDBConnection from "./db"
import { sessionOptions, cors, port, createSchema } from "./config"

useContainer(Container)

async function main() {
  try {
    await createDBConnection()

    const schema = await createSchema()

    const app = express()
      .enable("trust proxy")
      .use(morgan("dev"))
      .use(session(sessionOptions))

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      introspection: true,
      playground: true,
      formatError: formatArgumentValidationError,
    })

    apolloServer.applyMiddleware({
      app,
      cors,
    })

    app.listen(port, () =>
      console.log(`Server started at http://localhost:${port} 🚀`),
    )
  } catch (error) {
    console.log(error)
  }
}

main()
