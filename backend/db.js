import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "91086790Jj",
  host: "localhost",
  port: 5432,
  database: "course-maker",
});

export default pool;
