"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
var pg_1 = require("pg");
// const pool = new Pool({
//   user: 'postgres',
//   password: '1234',
//   host: 'localhost',
//   port: 5432, // default Postgres port
//   database: 'RPG'
// });
var pool = new pg_1.Pool({
    user: 'rpg_bdd_user',
    password: '1Bs3FNjSY1XXeSbjkAI8kXITKOArgq6r',
    host: 'dpg-d0m93i95pdvs7391s2d0-a',
    port: 5432,
    database: 'rpg_bdd',
});
// host: dpg-d0m93i95pdvs7391s2d0-a.frankfurt-postgres.render.com
function query(text) {
    return pool.query(text);
}
exports.query = query;
