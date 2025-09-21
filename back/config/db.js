// import mysql from "mysql2/promise";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default prisma;
// const db = await mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "auth_demo",
// });

// export default db;