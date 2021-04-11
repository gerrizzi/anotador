var juego = {
    modo: 3,
    jugadores: {
        1: {
            puntos: 0,
            malas: true
        },
        2: {
            puntos: 0,
            malas: true
        }
    },
    puntos_x_modo: { 1: 16, 2: 20, 3: 30, 4: 40 }
}

$(document).ready(function () {
    $(".tablero").click(function () {
        let _this = $(this);
        let nro_jugador = _this.attr("jugador");
        let cant_puntos = _this.find(".cant-puntos");
        let suma_puntos = parseInt(cant_puntos.text()) + 1;
        let html_punto = `<div class="punto #NOMBRE_PUNTO#"></div>`;

        let puntos = _this.find(".punto");
        let ultimo_punto = puntos.length == 0 ? null : $(puntos[puntos.length - 1]);
        let ultimo_punto_nombre = ultimo_punto == null ? "" : ultimo_punto[0].className.match(/punto-[^\s]*/)[0];

        if (suma_puntos <= juego.puntos_x_modo[juego.modo + ""]) {
            SetCantPuntos(nro_jugador, suma_puntos);
        }

        if (ultimo_punto_nombre == "punto-arriba")
            ultimo_punto.parent().append(html_punto.replace("#NOMBRE_PUNTO#", "punto-derecha"));

        else if (ultimo_punto_nombre == "punto-derecha")
            ultimo_punto.parent().append(html_punto.replace("#NOMBRE_PUNTO#", "punto-abajo"));

        else if (ultimo_punto_nombre == "punto-abajo")
            ultimo_punto.parent().append(html_punto.replace("#NOMBRE_PUNTO#", "punto-izquierda"));

        else if (juego.modo != 1 && ultimo_punto_nombre == "punto-izquierda")
            ultimo_punto.parent().append(html_punto.replace("#NOMBRE_PUNTO#", "punto-medio"));

        else if ((juego.modo == 1 && ultimo_punto_nombre == "punto-izquierda") || (ultimo_punto_nombre == "punto-medio"))
            if (suma_puntos == ((juego.puntos_x_modo[juego.modo + ""] / 2) + 1)) {
                juego.jugadores[nro_jugador + ""].malas = false;
                _this.find(".punto").remove();
                _this.find(".divisor-puntos:first").append(html_punto.replace("#NOMBRE_PUNTO#", "punto-arriba"));
            }
            else if(suma_puntos >= juego.puntos_x_modo[juego.modo + ""] - 1){
                $("#conf-panel").fadeIn(100);
            }
            else {
                ultimo_punto.parent().next(".divisor-puntos").append(html_punto.replace("#NOMBRE_PUNTO#", "punto-arriba"));
            }
        else
            _this.find(".divisor-puntos:first").append(html_punto.replace("#NOMBRE_PUNTO#", "punto-arriba"));
    });

    console.log("Funcionando...");
});

function SaveConfiguracion() {
    juego.modo = $("#modo").val();

    CrearPanel(1, juego.modo);
    SetCantPuntos(1, 0);
    CrearPanel(2, juego.modo);
    SetCantPuntos(2, 0);
}

function CrearPanel(jugador, modo) {
    let tablero_puntos = $("#jugador-" + jugador + " .puntos");
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
}

function SetCantPuntos(jugador, puntos) {
    juego.jugadores[jugador + ""].puntos = puntos;
    $("#jugador-" + jugador + " .cant-puntos").text(puntos);
}

