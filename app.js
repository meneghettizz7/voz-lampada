import {
luzRef,
set,
onValue
} from "./firebase.js";

// =====================================
// ELEMENTOS DA PÁGINA
// =====================================

const btnVoz =
document.getElementById("btnVoz");

const btnLigar =
document.getElementById("btnLigar");

const btnDesligar =
document.getElementById("btnDesligar");

const textoVoz =
document.getElementById("textoVoz");

const status =
document.getElementById("status");

const iconeLampada =
document.getElementById("iconeLampada");

// =====================================
// RECONHECIMENTO DE VOZ
// =====================================

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

let reconhecimento = null;

let ouvindo = false;

if (SpeechRecognition) {


reconhecimento =
    new SpeechRecognition();


reconhecimento.lang =
    "pt-BR";


reconhecimento.continuous =
    false;


reconhecimento.interimResults =
    false;


// =================================
// COMEÇOU A OUVIR
// =================================

reconhecimento.onstart =
    function () {

        ouvindo = true;

        btnVoz.classList.add(
            "ouvindo"
        );

        textoVoz.textContent =
            "Ouvindo... fale agora";

    };


// =================================
// PAROU DE OUVIR
// =================================

reconhecimento.onend =
    function () {

        ouvindo = false;

        btnVoz.classList.remove(
            "ouvindo"
        );

        if (
            textoVoz.textContent ===
            "Ouvindo... fale agora"
        ) {

            textoVoz.textContent =
                "Toque no microfone para falar";

        }

    };


// =================================
// ERRO
// =================================

reconhecimento.onerror =
    function (event) {

        console.error(
            "Erro no reconhecimento:",
            event.error
        );


        ouvindo = false;

        btnVoz.classList.remove(
            "ouvindo"
        );


        if (
            event.error ===
            "not-allowed"
        ) {

            textoVoz.textContent =
                "Permita o acesso ao microfone.";

        } else {

            textoVoz.textContent =
                "Não consegui entender.";

        }

    };


// =================================
// RESULTADO DA VOZ
// =================================

reconhecimento.onresult =
    function (event) {

        const texto =
            event
                .results[0][0]
                .transcript
                .toLowerCase()
                .trim();


        console.log(
            "Você falou:",
            texto
        );


        textoVoz.textContent =
            `"${texto}"`;


        interpretarComando(
            texto
        );

    };


}

// =====================================
// BOTÃO DO MICROFONE
// =====================================

btnVoz.addEventListener(
"click",
function () {


    if (!SpeechRecognition) {

        textoVoz.textContent =
            "Seu navegador não suporta reconhecimento de voz.";

        return;
    }


    if (ouvindo) {

        reconhecimento.stop();

    } else {

        try {

            reconhecimento.start();

        } catch (erro) {

            console.error(
                erro
            );

        }

    }

}


);

// =====================================
// INTERPRETAR COMANDO
// =====================================


// =====================================
// INTERPRETAR COMANDO
// =====================================

function interpretarComando(texto) {

    // ---------------------------------
    // PISCAR A LUZ
    // ---------------------------------

    if (
        texto.includes("piscar") ||
        texto.includes("pisque") ||
        texto.includes("flamengo") ||
        texto.includes("zona") ||
        texto.includes("festa")
    ) {

        textoVoz.textContent =
            "✓ Comando reconhecido: piscando a luz";

        piscarLuz();

        return;
    }


    // ---------------------------------
    // LIGAR
    // ---------------------------------

    if (
        texto.includes("acender") ||
        texto.includes("acende") ||
        texto.includes("ligar") ||
        texto.includes("liga") ||
        texto.includes("ligue")
    ) {

        controlarLuz(true);

        textoVoz.textContent =
            "✓ Comando reconhecido: ligar";

        return;
    }


    // ---------------------------------
    // DESLIGAR
    // ---------------------------------

    if (
        texto.includes("apagar") ||
        texto.includes("apaga") ||
        texto.includes("apague") ||
        texto.includes("desligar") ||
        texto.includes("desliga") ||
        texto.includes("desligue")
    ) {

        controlarLuz(false);

        textoVoz.textContent =
            "✓ Comando reconhecido: desligar";

        return;
    }


    // ---------------------------------
    // COMANDO NÃO RECONHECIDO
    // ---------------------------------

    textoVoz.textContent =
        "Comando não reconhecido.";
}


// =====================================
// PISCAR A LUZ
// =====================================

async function piscarLuz() {

    console.log("Iniciando efeito de piscar...");

    try {

        for (let i = 0; i < 3; i++) {

            console.log("Piscada:", i + 1);

            // LIGA
            await controlarLuz(true);

            // Espera 1 segundo
            await esperar(1000);

            // DESLIGA
            await controlarLuz(false);

            // Espera 1 segundo
            await esperar(1000);
        }

        textoVoz.textContent =
            "✓ Luz piscou 3 vezes";

        console.log("Efeito finalizado.");

    } catch (erro) {

        console.error(
            "Erro ao piscar a luz:",
            erro
        );

        textoVoz.textContent =
            "Erro ao fazer a luz piscar.";
    }
}


// =====================================
// ESPERA
// =====================================

function esperar(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}


// =====================================
// ENVIAR ESTADO PARA O FIREBASE
// =====================================

async function controlarLuz(estado) {

    try {

        console.log(
            "Enviando para Firebase:",
            estado
        );

        await set(
            luzRef,
            estado
        );

        console.log(
            "Firebase atualizado:",
            estado
        );

    } catch (erro) {

        console.error(
            "Erro ao enviar para Firebase:",
            erro
        );

        throw erro;
    }
}



// =====================================
// BOTÃO LIGAR
// =====================================

btnLigar.addEventListener(
"click",
function () {


    controlarLuz(true);

}


);

// =====================================
// BOTÃO DESLIGAR
// =====================================

btnDesligar.addEventListener(
"click",
function () {


    controlarLuz(false);

}


);

// =====================================
// ESCUTAR O FIREBASE
// =====================================

onValue(
luzRef,
function (snapshot) {


    const valor =
        snapshot.val();


    const ligada =
        valor === true;


    atualizarInterface(
        ligada
    );

}


);

// =====================================
// ATUALIZAR INTERFACE
// =====================================

function atualizarInterface(ligada) {


if (ligada) {

    status.textContent =
        "LUZ LIGADA";


    status.classList.remove(
        "desligada"
    );


    status.classList.add(
        "ligada"
    );


    iconeLampada.classList.add(
        "ligada"
    );

} else {

    status.textContent =
        "LUZ DESLIGADA";


    status.classList.remove(
        "ligada"
    );


    status.classList.add(
        "desligada"
    );


    iconeLampada.classList.remove(
        "ligada"
    );

}


}
