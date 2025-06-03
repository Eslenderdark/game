import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import bodyParser from "body-parser";
import * as db from "./db-connection";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ------------------- Middlewares -------------------
app.use(cors({ origin: "http://localhost:8100", optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "dist/draw_board")));

// ------------------- Variables -------------------
const salas: any = [];
let users: { [key: string]: Set<{ nombre: string; personaje: string }> } = {};

// ------------------- Endpoints HTTP -------------------


app.post('/guardarusuario', async (req, res) => {
  const { name, email } = req.body;

  try {
    await db.query(`
      INSERT INTO players (name, email) VALUES ('${name}', '${email}');
    `);
    res.json({ message: 'Usuario guardado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error guardando usuario' });
  }
});



// Obtener un jugador por ID
app.get("/player/:id", async (req, res) => {
  const id = req.params.id;
  console.log("Petición recibida", id);

  try {
    const query = `SELECT * FROM players WHERE id = '${id}'`;
    const db_response = await db.query(query);

    if (db_response.rowCount === 1) {
      console.log(`Personaje encontrado con el id: '${id}'.`);
      res.json(db_response.rows[0]);
    } else {
      console.log(`No se encontró el personaje con ID ${id}.`);
      res.status(404).json({ error: true, message: "Player not found" });
    }
  } catch (err) {
    console.error("Error en la consulta:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// Crear nuevo personaje
app.post("/crearpersonaje", async (req, res) => {
  const player = req.body;
  console.log("Creando personaje", player);

  try {
    await db.query(`
      INSERT INTO players (
        id, name, heal_points, mana_point, strength,
        magical_damage, defense, critical_chance, critical_damage,
        experience, level, coins, personaje
      ) VALUES (
        '${player.id}', '${player.name}', ${player.hp}, ${player.pc},
        ${player.strength}, ${player.magicDMG}, ${player.defense},
        ${player.crit_chance}, ${player.crit_DMG}, ${player.experience},
        ${player.level}, ${player.gold}, '${player.personaje}'
      );
    `);
    res.status(201).json({ message: "Personaje creado correctamente" });
  } catch (error) {
    console.error("Error al crear el personaje:", error);
    res.status(500).json({ error: "Error al crear el personaje" });
  }
});

// Obtener todos los personajes base
app.get("/personajes", async (req, res) => {
  try {
    const query = `SELECT * FROM personajes`;
    const db_response = await db.query(query);

    if (db_response.rows.length > 0) {
      console.log(`Se encontraron ${db_response.rows.length} personajes.`);
      res.json(db_response.rows);
    } else {
      console.log("No se encontraron personajes.");
      res.status(404).json({ message: "No characters found" });
    }
  } catch (err) {
    console.error("Error en la consulta:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Incrementar pases de personaje
app.get("/passes/:id", async (req, res) => {
  const id = req.params.id;
  console.log("Actualizando pases para el personaje", id);

  try {
    const query = `UPDATE personajes SET pases = pases + 1 WHERE id = ${id}`;
    const db_response = await db.query(query);

    if (db_response.rowCount === 1) {
      console.log(`Pass actualizado para personaje con ID ${id}.`);
      res.json({ message: "Pases actualizados" });
    } else {
      console.log(`No se encontró el personaje con ID ${id}.`);
      res.status(404).json({ message: "Personaje no encontrado" });
    }
  } catch (err) {
    console.error("Error en la consulta:", err);
    res.status(500).send("Error interno del servidor");
  }
});

// ------------------- WebSocket -------------------
io.on("connection", (socket: any) => {
  console.log("🟢 Nuevo cliente conectado");

  // Pedir al cliente que envíe las salas
  socket.emit("pedir_salas");

  socket.on("enviar_salas", (salas: any) => {
    console.log("📦 Salas recibidas del cliente:", salas);

    socket.on("disconnect", () => {
      const { username, room_code } = socket.data;

      if (username && room_code) {
        const roomUsers = users[room_code];
        if (roomUsers) {
          roomUsers.forEach((user) => {
            if (user.nombre === username) {
              roomUsers.delete(user);
            }
          });
          if (roomUsers.size === 0) {
            delete users[room_code];
          }
          io.emit("user_list_" + room_code, Array.from(users[room_code] || []));
          io.emit("user left", username);
          console.log(`🔴 ${username} salió de la sala ${room_code}`);
        }
      }
    });
  });

  // Unirse a una sala
  socket.on("join_room", (info: any) => {
    const { code, user_name, personaje } = info;

    socket.join(code);
    socket.data.username = user_name;
    socket.data.room_code = code;

    if (!users[code]) {
      users[code] = new Set();
    }

    users[code].add({ nombre: user_name, personaje });
    io.emit("user_list_" + code, Array.from(users[code]));

    console.log(`🧍 Usuario ${user_name} con personaje ${personaje} se unió a la sala ${code}`);
  });
});

// ------------------- Inicio del servidor -------------------
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${port}.
  
  ENDPOINTS DISPONIBLES:
   - GET    /player/:id
   - POST   /crearpersonaje
   - GET    /personajes
   - GET    /passes/:id
  `);
});
