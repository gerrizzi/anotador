var juego = {
    modo: 8,
    jugadores: {
        1: {
            nombre: "Nosotros",
            puntos: 0,
            malas: () => {
                return juego.jugadores["1"].puntos <= (GetPuntosXModo(modo) / 2);
            },
            gano: () => {
                return juego.jugadores["1"].puntos >= GetPuntosXModo(modo);
            }
        },
        2: {
            nombre: "Ellos",
            puntos: 0,
            malas: () => {
                return juego.jugadores["2"].puntos <= (GetPuntosXModo(modo) / 2);
            },
            gano: () => {
                return juego.jugadores["2"].puntos >= GetPuntosXModo(modo);
            }
        }
    },
    puntos_x_modo: { 1: 9, 2: 10, 3: 12, 4: 15, 5: 18, 6: 20, 7: 24, 8: 30, 9: 40 }
}

$(document).ready(function () {
    $(".tablero").click(function () {
        let _this = $(this);
        let nro_jugador = _this.attr("jugador");

        if (!CheckearSiGanoJugador(nro_jugador)) {
            AddPunto(nro_jugador);
        }
        else {
            $("#conf-panel").fadeIn(100);
        }
    });

    console.log("Funcionando...");
});

function AddPuntos(nro_jugador, puntos) {
    for (let i = 0; i < puntos; i++)
        AddPunto(nro_jugador);
}

function AddPunto(nro_jugador) {
    let jugador = GetDataJugador(nro_jugador);

    IncrementarPuntosJugador(nro_jugador);
    SetCantTableroPuntos(nro_jugador, jugador.puntos);
    RemoveTableroPuntosSiPasoABuenas(nro_jugador);
    AddTableroPunto(nro_jugador);
}

function AddTableroPunto(nro_jugador) {
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
    return juego.jugadores[nro_jugador + ""];
}

function GetPuntosXModo(modo) {
    return juego.puntos_x_modo[juego.modo + ""];
}

function SaveConfiguracion() {
    juego.modo = $("#modo").val();

    CrearPanel(1, juego.modo);
    SetPuntosJugador(1, 0);
    CrearPanel(2, juego.modo);
    SetPuntosJugador(2, 0);
}

function CrearPanel(nro_jugador, modo) {
    let tablero_puntos = $("#jugador-" + nro_jugador + " .puntos");
    let html_divisor = `<div class="divisor-puntos"></div>`;

    switch (modo) {
        case "1":
            tablero_puntos.html(html_divisor + html_divisor);
            break;
        case "2":
            tablero_puntos.html(html_divisor + html_divisor);
            break;
        case "3":
            tablero_puntos.html(html_divisor + html_divisor + html_divisor);
            break;
        case "4":
            tablero_puntos.html(html_divisor + html_divisor + html_divisor + html_divisor);
            break;
    }

    SetCantTableroPuntos(nro_jugador, 0);
}