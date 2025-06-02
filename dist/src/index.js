"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var socket_io_1 = require("socket.io");
var http_1 = __importDefault(require("http"));
var path_1 = __importDefault(require("path"));
var body_parser_1 = __importDefault(require("body-parser"));
var db = __importStar(require("./db-connection"));
var app = express_1.default();
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
// ------------------- Middlewares -------------------
app.use(cors_1.default({ origin: "http://localhost:8100", optionsSuccessStatus: 200 }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, "dist/draw_board")));
// ------------------- Variables -------------------
var salas = [];
var users = {};
// ------------------- Endpoints HTTP -------------------
// Obtener un jugador por ID
app.get("/player/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, query, db_response, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                console.log("Petición recibida", id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                query = "SELECT * FROM players WHERE id = '" + id + "'";
                return [4 /*yield*/, db.query(query)];
            case 2:
                db_response = _a.sent();
                if (db_response.rowCount === 1) {
                    console.log("Personaje encontrado con el id: '" + id + "'.");
                    res.json(db_response.rows[0]);
                }
                else {
                    console.log("No se encontr\u00F3 el personaje con ID " + id + ".");
                    res.status(404).json({ error: true, message: "Player not found" });
                }
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error("Error en la consulta:", err_1);
                res.status(500).send("Error interno del servidor");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Crear nuevo personaje
app.post("/crearpersonaje", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var player, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                player = req.body;
                console.log("Creando personaje", player);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db.query("\n      INSERT INTO players (\n        id, name, heal_points, mana_point, strength,\n        magical_damage, defense, critical_chance, critical_damage,\n        experience, level, coins, personaje\n      ) VALUES (\n        '" + player.id + "', '" + player.name + "', " + player.hp + ", " + player.pc + ",\n        " + player.strength + ", " + player.magicDMG + ", " + player.defense + ",\n        " + player.crit_chance + ", " + player.crit_DMG + ", " + player.experience + ",\n        " + player.level + ", " + player.gold + ", '" + player.personaje + "'\n      );\n    ")];
            case 2:
                _a.sent();
                res.status(201).json({ message: "Personaje creado correctamente" });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error al crear el personaje:", error_1);
                res.status(500).json({ error: "Error al crear el personaje" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Obtener todos los personajes base
app.get("/personajes", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, db_response, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                query = "SELECT * FROM personajes";
                return [4 /*yield*/, db.query(query)];
            case 1:
                db_response = _a.sent();
                if (db_response.rows.length > 0) {
                    console.log("Se encontraron " + db_response.rows.length + " personajes.");
                    res.json(db_response.rows);
                }
                else {
                    console.log("No se encontraron personajes.");
                    res.status(404).json({ message: "No characters found" });
                }
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.error("Error en la consulta:", err_2);
                res.status(500).send("Internal Server Error");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Incrementar pases de personaje
app.get("/passes/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, query, db_response, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                console.log("Actualizando pases para el personaje", id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                query = "UPDATE personajes SET pases = pases + 1 WHERE id = " + id;
                return [4 /*yield*/, db.query(query)];
            case 2:
                db_response = _a.sent();
                if (db_response.rowCount === 1) {
                    console.log("Pass actualizado para personaje con ID " + id + ".");
                    res.json({ message: "Pases actualizados" });
                }
                else {
                    console.log("No se encontr\u00F3 el personaje con ID " + id + ".");
                    res.status(404).json({ message: "Personaje no encontrado" });
                }
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.error("Error en la consulta:", err_3);
                res.status(500).send("Error interno del servidor");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// ------------------- WebSocket -------------------
io.on("connection", function (socket) {
    console.log("🟢 Nuevo cliente conectado");
    // Pedir al cliente que envíe las salas
    socket.emit("pedir_salas");
    socket.on("enviar_salas", function (salas) {
        console.log("📦 Salas recibidas del cliente:", salas);
        socket.on("disconnect", function () {
            var _a = socket.data, username = _a.username, room_code = _a.room_code;
            if (username && room_code) {
                var roomUsers_1 = users[room_code];
                if (roomUsers_1) {
                    roomUsers_1.forEach(function (user) {
                        if (user.nombre === username) {
                            roomUsers_1.delete(user);
                        }
                    });
                    if (roomUsers_1.size === 0) {
                        delete users[room_code];
                    }
                    io.emit("user_list_" + room_code, Array.from(users[room_code] || []));
                    io.emit("user left", username);
                    console.log("\uD83D\uDD34 " + username + " sali\u00F3 de la sala " + room_code);
                }
            }
        });
    });
    // Unirse a una sala
    socket.on("join_room", function (info) {
        var code = info.code, user_name = info.user_name, personaje = info.personaje;
        socket.join(code);
        socket.data.username = user_name;
        socket.data.room_code = code;
        if (!users[code]) {
            users[code] = new Set();
        }
        users[code].add({ nombre: user_name, personaje: personaje });
        io.emit("user_list_" + code, Array.from(users[code]));
        console.log("\uD83E\uDDCD Usuario " + user_name + " con personaje " + personaje + " se uni\u00F3 a la sala " + code);
    });
});
// ------------------- Inicio del servidor -------------------
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log("\uD83D\uDE80 Servidor escuchando en el puerto " + port + ".\n  \n  ENDPOINTS DISPONIBLES:\n   - GET    /player/:id\n   - POST   /crearpersonaje\n   - GET    /personajes\n   - GET    /passes/:id\n  ");
});
