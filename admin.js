import {
    db,
    ref,
    get,
    child,
    remove
} from "./firebase.js";


// ===============================
// HORÁRIOS FIXOS
// ===============================

const horariosFixos = [
    "09:30",
    "10:30",
    "11:30",
    "12:30",
    "13:30",
    "14:30",
    "15:30",
    "16:30"
];


// ===============================
// VARIÁVEIS
// ===============================

let todosAgendamentos = {};


// ===============================
// DATA LOCAL
// ===============================

function dataLocal() {
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


// ===============================
// LOGIN ADM
// ===============================

window.entrar = async function () {

    const campoSenha = document.getElementById("senha");

    if (!campoSenha) {
        alert("Campo de senha não encontrado.");
        return;
    }

    const senha = campoSenha.value;

    if (senha !== "1234") {
        alert("Senha incorreta!");
        return;
    }

    document.getElementById("login").style.display = "none";
    document.getElementById("painel").style.display = "block";

    await carregarAgendamentos();
};


// ===============================
// PREÇO DOS SERVIÇOS
// ===============================

function obterValorServico(servico) {

    if (!servico) {
        return 0;
    }

    const nome = servico.toLowerCase();

    if (nome.includes("progressiva")) {
        return 120;
    }

    if (nome.includes("botox")) {
        return 99;
    }

    if (nome.includes("cronograma")) {
        return 99;
    }

    if (nome.includes("selagem")) {
        return 79.99;
    }

    if (nome.includes("tratamento")) {
        return 69.99;
    }

    if (nome.includes("escova")) {
        return 50;
    }

    return 0;
}


// ===============================
// FORMATAR DINHEIRO
// ===============================

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// ===============================
// CARREGAR AGENDAMENTOS
// ===============================

async function carregarAgendamentos() {

    const lista = document.getElementById("lista");

    if (!lista) {
        console.error("Elemento #lista não encontrado.");
        return;
    }

    lista.innerHTML = "Carregando...";

    try {

        const snapshot = await get(
            child(ref(db), "agendamentos")
        );

        if (!snapshot.exists()) {

            todosAgendamentos = {};

            lista.innerHTML =
                "<p>Nenhum agendamento encontrado.</p>";

            atualizarResumo();

            mostrarAgendaHoje();

            return;
        }

        todosAgendamentos = snapshot.val();

        renderizarAgendamentos();

        atualizarResumo();

        mostrarAgendaHoje();

    } catch (erro) {

        console.error("Erro ao carregar agendamentos:", erro);

        lista.innerHTML =
            "<p>Erro ao carregar os agendamentos.</p>";

    }

}


// ===============================
// RENDERIZAR LISTA
// ===============================

function renderizarAgendamentos() {

    const lista = document.getElementById("lista");

    if (!lista) return;

    lista.innerHTML = "";

    const pesquisaElement =
        document.getElementById("pesquisa");

    const pesquisa =
        pesquisaElement
            ? pesquisaElement.value.trim().toLowerCase()
            : "";

    let encontrados = 0;


    // Ordenar agendamentos por data e horário

    const agendamentos = Object.entries(todosAgendamentos)
        .sort((a, b) => {

            const itemA = a[1];
            const itemB = b[1];

            const dataA =
                `${itemA.data || ""} ${itemA.horario || ""}`;

            const dataB =
                `${itemB.data || ""} ${itemB.horario || ""}`;

            return dataA.localeCompare(dataB);

        });


    for (const [chave, item] of agendamentos) {

        const nome =
            item.nome || "Cliente";

        const telefone =
            item.telefone || "";

        const servico =
            item.servico || "Serviço não informado";

        const data =
            item.data || "";

        const horario =
            item.horario || "";


        // Pesquisa

        if (
            pesquisa &&
            !nome.toLowerCase().includes(pesquisa) &&
            !telefone.toLowerCase().includes(pesquisa) &&
            !servico.toLowerCase().includes(pesquisa)
        ) {
            continue;
        }


        encontrados++;


        const valor =
            obterValorServico(servico);


        const dataFormatada =
            data
                ? data.split("-").reverse().join("/")
                : "--/--/----";


        // WhatsApp

        const telefoneLimpo =
            telefone.replace(/\D/g, "");


        const mensagemConfirmacao =
`Olá ${nome}! 🌸

Seu horário está confirmado no Toda Bella Studio.

📅 Data: ${dataFormatada}
⏰ Horário: ${horario}
💇 Serviço: ${servico}

Aguardamos você! 💕`;


        let linkWhatsApp = "#";

        if (telefoneLimpo) {

            linkWhatsApp =
                `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(
                    mensagemConfirmacao
                )}`;

        }


        // Card

        lista.innerHTML += `

            <div class="agendamento-card">

                <div class="agendamento-info">

                    <h3>👩 ${nome}</h3>

                    <p>
                        📅 <strong>${dataFormatada}</strong>
                    </p>

                    <p>
                        ⏰ <strong>${horario}</strong>
                    </p>

                    <p>
                        💇 ${servico}
                    </p>

                    <p>
                        📱 ${telefone || "Telefone não informado"}
                    </p>

                    <p>
                        💰 ${formatarMoeda(valor)}
                    </p>

                </div>


                <div class="agendamento-acoes">

                    ${
                        telefoneLimpo
                        ? `
                        <a
                            href="${linkWhatsApp}"
                            target="_blank"
                            class="btn-whatsapp"
                        >
                            💬 WhatsApp
                        </a>
                        `
                        : ""
                    }


                    <button
                        onclick="excluirAgendamento('${chave}')"
                        class="btn-excluir"
                    >
                        🗑️ Excluir
                    </button>

                </div>

            </div>

        `;

    }


    if (encontrados === 0) {

        lista.innerHTML =
            "<p>Nenhum cliente encontrado.</p>";

    }

}


// ===============================
// RESUMO DO PAINEL
// ===============================

function atualizarResumo() {

    let faturamento = 0;
    let faturamentoHoje = 0;

    let agendamentosHoje = 0;
    let agendamentosAmanha = 0;

    let clientesMes = 0;
    let faturamentoMes = 0;

    const servicosContador = {};


    const hojeTexto = dataLocal();

    const hoje = new Date();

    const amanha = new Date(hoje);

    amanha.setDate(
        amanha.getDate() + 1
    );


    const anoAmanha =
        amanha.getFullYear();

    const mesAmanha =
        String(amanha.getMonth() + 1)
            .padStart(2, "0");

    const diaAmanha =
        String(amanha.getDate())
            .padStart(2, "0");

    const amanhaTexto =
        `${anoAmanha}-${mesAmanha}-${diaAmanha}`;


    const mesAtual =
        hojeTexto.substring(0, 7);


    for (const chave in todosAgendamentos) {

        const item =
            todosAgendamentos[chave];

        const valor =
            obterValorServico(item.servico);


        // Total

        faturamento += valor;


        // Hoje

        if (item.data === hojeTexto) {

            agendamentosHoje++;

            faturamentoHoje += valor;

        }


        // Amanhã

        if (item.data === amanhaTexto) {

            agendamentosAmanha++;

        }


        // Mês

        if (
            item.data &&
            item.data.startsWith(mesAtual)
        ) {

            clientesMes++;

            faturamentoMes += valor;


            const servico =
                item.servico || "Não informado";


            servicosContador[servico] =
                (servicosContador[servico] || 0) + 1;

        }

    }


    // Serviço mais vendido

    let servicoMaisVendido = "-";

    let maior = 0;


    for (
        const servico in servicosContador
    ) {

        if (
            servicosContador[servico] > maior
        ) {

            maior =
                servicosContador[servico];

            servicoMaisVendido =
                servico;

        }

    }


    // Atualizar elementos

    const hojeElemento =
        document.getElementById("hoje");

    if (hojeElemento) {

        hojeElemento.innerHTML =
            `📅 Hoje: ${agendamentosHoje}`;

    }


    const amanhaElemento =
        document.getElementById("amanha");

    if (amanhaElemento) {

        amanhaElemento.innerHTML =
            `📅 Amanhã: ${agendamentosAmanha}`;

    }


    const faturamentoHojeElemento =
        document.getElementById("faturamentoHoje");

    if (faturamentoHojeElemento) {

        faturamentoHojeElemento.innerHTML =
            `💰 Hoje: ${formatarMoeda(faturamentoHoje)}`;

    }


    const faturamentoElemento =
        document.getElementById("faturamento");

    if (faturamentoElemento) {

        faturamentoElemento.innerHTML =
            `💰 Total: ${formatarMoeda(faturamento)}`;

    }


    const clientesMesElemento =
        document.getElementById("clientesMes");

    if (clientesMesElemento) {

        clientesMesElemento.innerHTML =
            `👩 Clientes: ${clientesMes}`;

    }


    const faturamentoMesElemento =
        document.getElementById("faturamentoMes");

    if (faturamentoMesElemento) {

        faturamentoMesElemento.innerHTML =
            `💰 Faturamento Mensal: ${formatarMoeda(faturamentoMes)}`;

    }


    const servicoElemento =
        document.getElementById("servicoMaisVendido");

    if (servicoElemento) {

        servicoElemento.innerHTML =
            `⭐ Serviço Mais Vendido: ${servicoMaisVendido}`;

    }

}


// ===============================
// AGENDA DE HOJE
// ===============================

function mostrarAgendaHoje() {

    gerarAgenda(dataLocal());

}


// ===============================
// ESCOLHER DATA DA AGENDA
// ===============================

window.mostrarAgendaData = function () {

    const campo =
        document.getElementById("dataAgenda");


    if (!campo) {

        alert("Campo de data não encontrado.");

        return;

    }


    const data =
        campo.value;


    if (!data) {

        alert("Selecione uma data.");

        return;

    }


    gerarAgenda(data);

};


// ===============================
// GERAR AGENDA
// ===============================

function gerarAgenda(dataSelecionada) {

    const agenda =
        document.getElementById("agenda");


    if (!agenda) {

        console.error(
            "Elemento #agenda não encontrado."
        );

        return;

    }


    const ocupados = [];


    for (
        const chave in todosAgendamentos
    ) {

        const item =
            todosAgendamentos[chave];


        if (
            item.data === dataSelecionada
        ) {

            ocupados.push({

                horario: item.horario,

                nome: item.nome,

                chave: chave

            });

        }

    }


    const dataFormatada =
        dataSelecionada
            .split("-")
            .reverse()
            .join("/");


    let agendaHTML = `

        <div class="agenda-titulo">

            <h3>
                📅 Agenda do dia ${dataFormatada}
            </h3>

        </div>

        <div class="agenda-horarios">

    `;


    horariosFixos.forEach(horario => {

        const ocupado =
            ocupados.find(
                item =>
                    item.horario === horario
            );


        if (ocupado) {

            agendaHTML += `

                <div class="horario ocupado">

                    <div>
                        <strong>⏰ ${horario}</strong>

                        <span>
                            🔴 Ocupado
                        </span>
                    </div>

                    <div>
                        👩 ${ocupado.nome}
                    </div>

                    <button
                        onclick="excluirAgendamento('${ocupado.chave}')"
                        class="btn-excluir"
                    >
                        🗑️
                    </button>

                </div>

            `;

        } else {

            agendaHTML += `

                <div class="horario disponivel">

                    <div>
                        <strong>⏰ ${horario}</strong>
                    </div>

                    <span>
                        🟢 Disponível
                    </span>

                </div>

            `;

        }

    });


    agendaHTML += `

        </div>

    `;


    agenda.innerHTML =
        agendaHTML;

}


// ===============================
// EXCLUIR AGENDAMENTO
// ===============================

window.excluirAgendamento =
    async function (chave) {

        if (
            !confirm(
                "Deseja realmente excluir este agendamento?"
            )
        ) {

            return;

        }


        try {

            await remove(
                ref(
                    db,
                    `agendamentos/${chave}`
                )
            );


            alert(
                "Agendamento excluído com sucesso!"
            );


            await carregarAgendamentos();


        } catch (erro) {

            console.error(
                "Erro ao excluir:",
                erro
            );


            alert(
                "Erro ao excluir o agendamento."
            );

        }

    };


// ===============================
// PESQUISA
// ===============================

window.pesquisarCliente =
    function () {

        renderizarAgendamentos();

    };
