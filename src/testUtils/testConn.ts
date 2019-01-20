import { createConnection } from "typeorm"

export const testConn = (drop: boolean = false) => {
  return createConnection({
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "habit_test",
    synchronize: drop,
    dropSchema: drop,
    entities: [__dirname + "/../modules/**/*.entity.ts"],
  })
}
