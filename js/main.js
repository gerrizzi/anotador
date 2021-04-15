const db = new Dexie("AnotadorDB");

const DEFAULT_GAME_CONF = {
    modo: 8,
    jugadores: {
        1: {
            nombre: "Nosotros",
            puntos: 0,
            malas: function () {
                return this.puntos <= (GetPuntosXModo(modo) / 2);
            },
            gano: function () {
                return this.puntos >= GetPuntosXModo(modo);
            }
        },
        2: {
            nombre: "Ellos",
            puntos: 0,
            malas: function () {
                return this.puntos <= (GetPuntosXModo(modo) / 2);
            },
            gano: function () {
                return this.puntos >= GetPuntosXModo(modo);
            }
        }
    },
    puntos_x_modo: { 1: 9, 2: 10, 3: 12, 4: 15, 5: 18, 6: 20, 7: 24, 8: 30, 9: 40 }
};

var CURRENT_GAME_CONF = { ...DEFAULT_GAME_CONF };

$(document).ready(function () {
    //Creo la bd si no existe
    InitDB();

    //Cargo el ultimo juego jugado
    LoadLastJuego();

    console.log("Funcionando...");

    // $(".hambuger-menu-icon").click(function () {
    //     $(this).toggleClass('change');
    // });
});

$(document).on("click", ".tablero", function () {
    let _this = $(this);
    let nro_jugador = _this.attr("jugador");

    if (!CheckearSiGanoJugador(nro_jugador)) {
        IncrementarPuntosJugador(nro_jugador);
        SetCantTableroPuntos(nro_jugador, GetDataJugador(nro_jugador).puntos);
        DrawPoint(nro_jugador);
        RemoveTableroPuntosSiPasoABuenas(nro_jugador);
    }
    else {
        $("#conf-panel").fadeIn(100);
    }

    AddOrUpdateJuego(CURRENT_GAME_CONF);
});

function CheckearSiGanoJugador(nro_jugador) {
    return GetDataJugador(nro_jugador).gano();
}

function RemoveTableroPuntosSiPasoABuenas(nro_jugador) {
    if (CheckearSiPasoABuenas(nro_jugador))
        RemoveAllTableroPuntosJugador(nro_jugador);
}

function CheckearSiPasoABuenas(nro_jugador) {
    let puntos_x_modo = GetPuntosXModo();

    if (puntos_x_modo > 15 && GetDataJugador(nro_jugador).puntos == (puntos_x_modo / 2) + 1)
        return true;
    else
        return false;
}

function RemoveAllTableroPuntosJugador(nro_jugador) {
    $("#jugador-" + nro_jugador).find(".punto").remove();
}

function RemoveAllTableroPuntos() {
    $(".puntos").remove();
}

function DecrementarPuntoJugador(nro_jugador) {
    let jugador = GetDataJugador(nro_jugador);

    if (jugador.puntos > 0)
        jugador.puntos -= 1;
}

function IncrementarPuntosJugador(nro_jugador) {
    GetDataJugador(nro_jugador).puntos += 1;
}

function SetPuntosJugador(nro_jugador, puntos) {
    GetDataJugador(nro_jugador).puntos = puntos;
}

function SetCantTableroPuntos(nro_jugador, puntos) {
    $("#jugador-" + nro_jugador + " .cant-puntos").text(puntos);
}

function GetDataJugador(nro_jugador) {
    return CURRENT_GAME_CONF.jugadores[nro_jugador + ""];
}

function GetPuntosXModo(modo) {
    return CURRENT_GAME_CONF.puntos_x_modo[CURRENT_GAME_CONF.modo + ""];
}

function SaveConfiguracion() {
    CURRENT_GAME_CONF = { ...DEFAULT_GAME_CONF };
    CURRENT_GAME_CONF.modo = $("#modo").val();

    DrawGame(CURRENT_GAME_CONF);
}

function DrawGame(juego) {
    //Cargo los tableros seguno los puntos de cada jugador
    DrawTablero(1, juego.modo, juego.jugadores["1"].puntos);
    DrawTablero(2, juego.modo, juego.jugadores["2"].puntos);
}

function DrawTablero(nro_jugador, modo, puntos = 0) {
    DrawTableroDivisores(nro_jugador, modo);
    DrawPoints(nro_jugador, puntos);
    SetCantTableroPuntos(nro_jugador, puntos);
}

function DrawTableroDivisores(nro_jugador, modo) {
    let tablero_puntos = $("#jugador-" + nro_jugador + " .puntos");
    let html_divisor = "";
    let cant_divisores = parseInt(modo) < 5 ? (GetPuntosXModo(modo) / 5) : (GetPuntosXModo(modo) / 5) / 2;

    for (let i = 0; i < cant_divisores; i++)
        html_divisor += `<div class="divisor-puntos"></div>`;

    tablero_puntos.html(html_divisor);
}

function DrawPoint(nro_jugador) {
    let tablero_jugador = $("#jugador-" + nro_jugador);
    let puntos = tablero_jugador.find(".punto");
    let ultimo_punto = puntos.length == 0 ? null : $(puntos[puntos.length - 1]);
    let ultimo_punto_nombre = ultimo_punto == null ? "" : ultimo_punto[0].className.match(/punto-[^\s]*/)[0];
    let es_de_a_5 = GetPuntosXModo(modo) % 5 == 0;

    let html_punto = `<div class="punto #NOMBRE_PUNTO#"></div>`;

    if (ultimo_punto_nombre == "punto-arriba")
        ultimo_punto.parent().append(html_punto.replace("#NOMBRE_PUNTO#", "punto-derecha"));

    else if (ultimo_punto_nombre == "punto-derecha")
        ultimo_punto.parent().append(html_punto.replace("#NOMBRE_PUNTO#", "punto-abajo"));

    else if (ultimo_punto_nombre == "punto-abajo")
        ultimo_punto.parent().append(html_punto.replace("#NOMBRE_PUNTO#", "punto-izquierda"));

    else if (es_de_a_5 && ultimo_punto_nombre == "punto-izquierda")
        ultimo_punto.parent().append(html_punto.replace("#NOMBRE_PUNTO#", "punto-medio"));

    else if ((!es_de_a_5 && ultimo_punto_nombre == "punto-izquierda") || (ultimo_punto_nombre == "punto-medio"))
        ultimo_punto.parent().next(".divisor-puntos").append(html_punto.replace("#NOMBRE_PUNTO#", "punto-arriba"));
    else
        tablero_jugador.find(".divisor-puntos:first").append(html_punto.replace("#NOMBRE_PUNTO#", "punto-arriba"));
}

function DrawPoints(nro_jugador, puntos) {
    for (let i = 0; i < puntos; i++)
        DrawPoint(nro_jugador);
}

function InitDB() {
    db.version(1).stores({
        juegos: '++id,modo,jugador_1_nombre,jugador_1_puntos,jugador_2_nombre,jugador_2_puntos'
    });
}

function DrawAllJuegos() {
    GetAllJuegos().then(function (juegos) {
        debugger;
        let html = "<tr><td colspan='4' style='text-align: center'>No hay juegos para mostrar</td></tr>";

        if (juegos && juegos[0])
            {
                html = "";
                for (let i = 0; i < juegos.length; i++) {
                    const juego = juegos[i];
                    let puntos_por_modo = GetPuntosXModo(juego.modo);
                    let nro_jugador_ganador = juego.jugador_1_puntos >= puntos_por_modo ? 1 : (juego.jugador_2_puntos >= puntos_por_modo ? 2 : 0); 
    
                    html += `<tr>
                                <td>${nro_jugador_ganador == 0 ? "Sin terminar" : "Ganador: "(juego["jugador_" + nro_jugador_ganador + "_puntos"])}</td>
                                <td style="text-align: center">${juego.jugador_1_puntos}</td>
                                <td style="text-align: center">${juego.jugador_2_puntos}</td>
                                <td onclick="GetAndLoadJuego(${juego.id}); HideAllModals();">Cargar</td>
                            </tr>`;
                }
            }

        $("#mis-partidas tbody").html(html);
    });
}

function LoadLastJuego() {
    db
        .open()
        .then(function () {
            return db.juegos.orderBy('id').last();
        })
        .then(function (data) {
            debugger;
            CURRENT_GAME_CONF = IndexedDbJuegoToJuego(data);

            DrawGame(CURRENT_GAME_CONF);
        });
}

function GetAndLoadJuego(juegoId){
    GetJuegoById(juegoId).then(function(juego){
        if(juego){
            CURRENT_GAME_CONF = IndexedDbJuegoToJuego(juego);
            DrawGame(CURRENT_GAME_CONF);
        }
    });
}

function GetJuegoById(juegoId){
    return db
    .open()
    .then(function () {
        return db.juegos.get(juegoId);
    });
}

function GetAllJuegos() {
    return db
           .open()
           .then(function () {
               return db.juegos.toArray();
           });
}

function AddOrUpdateJuego(juego) {
    let isUpdate = juego.hasOwnProperty("id") && juego.id !== undefined && juego.id != null && juego.id > 0;

    db
        .open()
        .then(function () {
            let _juego = JuegoToIndexedDbJuego(juego);

            //Si tiene id es un update
            if (isUpdate)
                return db.juegos.update(juego.id, _juego);
            //Si no es un add
            else
                return db.juegos.put(_juego);
        }).then(function (code) {
            if (!isUpdate && code > 0)
                juego.id = code;
        });
}

function IndexedDbJuegoToJuego(indexedDbJuego) {
    return {
        id: indexedDbJuego.id,
        modo: indexedDbJuego.modo,
        jugadores: {
            1: {
                nombre: indexedDbJuego.jugador_1_nombre,
                puntos: indexedDbJuego.jugador_1_puntos,
                malas: function () {
                    return this.puntos <= (GetPuntosXModo(modo) / 2);
                },
                gano: function () {
                    return this.puntos >= GetPuntosXModo(modo);
                }
            },
            2: {
                nombre: indexedDbJuego.jugador_2_nombre,
                puntos: indexedDbJuego.jugador_2_puntos,
                malas: function () {
                    return this.puntos <= (GetPuntosXModo(modo) / 2);
                },
                gano: function () {
                    return this.puntos >= GetPuntosXModo(modo);
                }
            }
        },
        puntos_x_modo: { 1: 9, 2: 10, 3: 12, 4: 15, 5: 18, 6: 20, 7: 24, 8: 30, 9: 40 }
    }
}

function JuegoToIndexedDbJuego(juego) {
    return {
        id: juego.id,
        modo: juego.modo,
        jugador_1_nombre: juego.jugadores["1"].nombre,
        jugador_1_puntos: juego.jugadores["1"].puntos,
        jugador_2_nombre: juego.jugadores["2"].nombre,
        jugador_2_puntos: juego.jugadores["2"].puntos
    }
}

function ShowModal(modalId) {
    modalId = modalId.indexOf("#") == 0 ? modalId : "#" + modalId;
    let modal = $(modalId + ".modal");

    if (!modal.is(":visible"))
        modal.fadeIn(150);
}

function HideModal(modalId) {
    modalId = modalId.indexOf("#") == 0 ? modalId : "#" + modalId;
    let modal = $(modalId + ".modal");

    if (modal.is(":visible"))
        modal.fadeOut(150);
}

function HideAllModals(){
    $(".modal:visible").fadeOut(150);
}