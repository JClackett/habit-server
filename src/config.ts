import session from "express-session"
import "dotenv/config"

import connectRedis from "connect-redis"
import { buildSchema } from "type-graphql"

import { redis } from "./redis"

import { authChecker } from "./lib/authChecker"
import { UserResolver } from "./modules/user/user.resolver"
import { StepResolver } from "./modules/step/step.resolver"
import { HabitResolver } from "./modules/habit/habit.resolver"

export const env = process.env.NODE_ENV || "development"

export const cors = {
  credentials: true,
  origin: ["*"],
}

const RedisStore = connectRedis(session)

export const port = process.env.PORT || 5000
export const path = "/graphql"

export const sessionOptions = {
  store: new RedisStore({ client: redis as any }),
  name: "habit.cookie",
  secret: process.env.APP_SECRET || "woooooooopp",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: env === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
  },
}

export const createSchema = () =>
  buildSchema({
    // resolvers: [__dirname + "/modules/**/*.resolver.ts"],
    resolvers: [UserResolver, StepResolver, HabitResolver],
    authChecker,
  })
