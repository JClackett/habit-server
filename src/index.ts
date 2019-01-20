import "reflect-metadata"
import "dotenv/config"
import { ApolloServer } from "apollo-server-express"
import express, { Request, Response } from "express"
import session from "express-session"
import morgan from "morgan"
import { useContainer, formatArgumentValidationError } from "type-graphql"
import { Container } from "typedi"
import { sessionOptions, cors, port, createSchema } from "./config"
import { getConnectionOptions, createConnection } from "typeorm"

useContainer(Container)

async function main() {
  try {
    // Create DB connection
    const options = await getConnectionOptions(process.env.NODE_ENV)

    await createConnection({
      ...options,
      name: "default",
      // @ts-ignore
      url: process.env.DATABASE_URL,
    })

    // Create graphql schema
    const schema = await createSchema()

    // Set up express
    const app = express()
      .use(morgan("dev"))
      .use(session(sessionOptions))

    // Set up apollo server
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
