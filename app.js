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

function interpretarComando(texto) {


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
// COMANDO NÃO ENCONTRADO
// ---------------------------------

textoVoz.textContent =
    "Comando não reconhecido.";


}

// =====================================
// ENVIAR ESTADO PARA O FIREBASE
// =====================================

async function controlarLuz(estado) {


try {

    await set(
        luzRef,
        estado
    );


    console.log(
        "Estado enviado:",
        estado
    );


} catch (erro) {

    console.error(
        "Erro ao enviar para Firebase:",
        erro
    );


    textoVoz.textContent =
        "Erro ao conectar ao Firebase.";

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
