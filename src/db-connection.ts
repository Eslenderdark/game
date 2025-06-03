import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'RPG'
});


// const pool = new Pool({
//   user: 'rpg_bdd_user',
//   password: '1Bs3FNjSY1XXeSbjkAI8kXITKOArgq6r',
//   host: 'dpg-d0m93i95pdvs7391s2d0-a',
//   port: 5432,
//   database: 'rpg_bdd',
  
// });







export function query(text: any): any {
  return pool.query(text);
}
