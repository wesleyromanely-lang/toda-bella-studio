import {
    db,
    ref,
    push,
    get,
    child,
    remove,
    update
} from "./firebase.js";


const CAMINHO =
    "controleFinanceiro";


// =====================================
// ELEMENTOS
// =====================================

const dataInput =
    document.getElementById("data");

const pessoasInput =
    document.getElementById("pessoas");

const ganhoInput =
    document.getElementById("ganho");

const formRegistro =
    document.getElementById("formRegistro");

const listaRegistros =
    document.getElementById("listaRegistros");

const filtroMes =
    document.getElementById("filtroMes");


// =====================================
// DATA LOCAL
// =====================================

function dataLocal() {

    const hoje =
        new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


// =====================================
// MÊS ATUAL
// =====================================

function mesAtual() {

    return dataLocal().substring(
        0,
        7
    );

}


// =====================================
// FORMATAR DATA
// =====================================

function formatarData(data) {

    if (!data) {

        return "--/--/----";

    }

    const partes =
        data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


// =====================================
// FORMATAR DINHEIRO
// =====================================

function formatarDinheiro(valor) {

    return Number(
        valor || 0
    ).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// =====================================
// SALVAR REGISTRO
// =====================================

formRegistro.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const data =
            dataInput.value;


        const pessoas =
            Number(
                pessoasInput.value
            );


        const ganho =
            Number(
                ganhoInput.value
            );


        // ---------------------------------
        // VALIDAÇÕES
        // ---------------------------------

        if (!data) {

            alert(
                "Selecione uma data."
            );

            return;

        }


        if (
            !Number.isInteger(pessoas) ||
            pessoas < 0
        ) {

            alert(
                "Digite uma quantidade válida de pessoas."
            );

            return;

        }


        if (
            Number.isNaN(ganho) ||
            ganho < 0
        ) {

            alert(
                "Digite um valor válido."
            );

            return;

        }


        const botao =
            document.getElementById(
                "btnSalvar"
            );


        botao.disabled =
            true;

        botao.textContent =
            "Salvando...";


        try {

            const registrosRef =
                ref(
                    db,
                    CAMINHO
                );


            const snapshot =
                await get(
                    registrosRef
                );


            let chaveExistente =
                null;


            // ---------------------------------
            // PROCURAR DATA EXISTENTE
            // ---------------------------------

            if (
                snapshot.exists()
            ) {

                const dados =
                    snapshot.val();


                for (
                    const chave in dados
                ) {

                    if (
                        dados[chave].data ===
                        data
                    ) {

                        chaveExistente =
                            chave;

                        break;

                    }

                }

            }


            // ---------------------------------
            // ATUALIZAR DATA EXISTENTE
            // ---------------------------------

            if (chaveExistente) {

                const confirmar =
                    confirm(
                        `Já existe um registro para ${formatarData(data)}.\n\n` +
                        `Deseja substituir os valores atuais?`
                    );


                if (!confirmar) {

                    return;

                }


                await update(
                    ref(
                        db,
                        `${CAMINHO}/${chaveExistente}`
                    ),
                    {
                        data: data,
                        pessoas: pessoas,
                        ganho: ganho
                    }
                );


                alert(
                    "Registro atualizado com sucesso! 🌸"
                );

            }


            // ---------------------------------
            // NOVO REGISTRO
            // ---------------------------------

            else {

                await push(
                    registrosRef,
                    {
                        data: data,
                        pessoas: pessoas,
                        ganho: ganho
                    }
                );


                alert(
                    "Dia salvo com sucesso! 🌸"
                );

            }


            pessoasInput.value =
                "";

            ganhoInput.value =
                "";

            dataInput.value =
                dataLocal();


            await carregarRegistros();

        }

        catch (erro) {

            console.error(
                "Erro ao salvar:",
                erro
            );


            alert(
                "Não foi possível salvar o registro.\n\n" +
                "Erro: " +
                (
                    erro.code ||
                    erro.message
                )
            );

        }

        finally {

            botao.disabled =
                false;

            botao.textContent =
                "💾 Salvar dia";

        }

    }
);


// =====================================
// CARREGAR REGISTROS
// =====================================

async function carregarRegistros() {

    listaRegistros.innerHTML = `
        <div class="carregando">
            Carregando registros...
        </div>
    `;


    try {

        const snapshot =
            await get(
                child(
                    ref(db),
                    CAMINHO
                )
            );


        if (!snapshot.exists()) {

            listaRegistros.innerHTML = `
                <div class="vazio">

                    <div class="icone-vazio">
                        📋
                    </div>

                    <strong>
                        Nenhum registro ainda
                    </strong>

                    <p>
                        Registre seu primeiro dia acima.
                    </p>

                </div>
            `;


            atualizarResumo({});

            atualizarResumoFiltro([]);

            return;

        }


        const dados =
            snapshot.val();


        atualizarResumo(
            dados
        );


        renderizarHistorico(
            dados
        );

    }

    catch (erro) {

        console.error(
            "Erro ao carregar:",
            erro
        );


        listaRegistros.innerHTML = `
            <div class="erro-box">

                ❌ Não foi possível carregar os registros.

                <br><br>

                ${erro.code || erro.message}

            </div>
        `;

    }

}


// =====================================
// MOSTRAR HISTÓRICO
// =====================================

function renderizarHistorico(
    dados
) {

    listaRegistros.innerHTML =
        "";


    const filtro =
        filtroMes.value;


    const registros =
        Object.entries(
            dados
        )
        .filter(
            ([chave, item]) => {

                if (!filtro) {

                    return true;

                }


                return (
                    item.data &&
                    item.data.startsWith(
                        filtro
                    )
                );

            }
        )
        .sort(
            (a, b) =>
                b[1].data.localeCompare(
                    a[1].data
                )
        );


    atualizarResumoFiltro(
        registros
    );


    if (
        registros.length === 0
    ) {

        listaRegistros.innerHTML = `
            <div class="vazio">

                <div class="icone-vazio">
                    📅
                </div>

                <strong>
                    Nenhum registro encontrado
                </strong>

                <p>
                    Não há registros para esse período.
                </p>

            </div>
        `;

        return;

    }


    registros.forEach(
        ([chave, item]) => {

            const pessoas =
                Number(
                    item.pessoas || 0
                );


            const ganho =
                Number(
                    item.ganho || 0
                );


            const registro =
                document.createElement(
                    "div"
                );


            registro.className =
                "registro";


            registro.innerHTML = `

                <div class="registro-data">

                    <div class="icone-data">
                        📅
                    </div>

                    <div>

                        <strong>
                            ${formatarData(item.data)}
                        </strong>

                        <small>
                            ${pessoas}
                            ${
                                pessoas === 1
                                ? "pessoa"
                                : "pessoas"
                            }
                        </small>

                    </div>

                </div>


                <div class="registro-valor">

                    <strong>
                        ${formatarDinheiro(ganho)}
                    </strong>

                    <small>
                        ganho do dia
                    </small>

                </div>


                <div class="registro-acoes">

                    <button
                        class="btn-editar"
                        onclick="editarRegistro('${chave}')"
                    >
                        ✏️
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="excluirRegistro('${chave}')"
                    >
                        🗑️
                    </button>

                </div>

            `;


            listaRegistros.appendChild(
                registro
            );

        }
    );

}


// =====================================
// RESUMO
// =====================================

function atualizarResumo(
    dados
) {

    const hoje =
        dataLocal();


    const mes =
        hoje.substring(
            0,
            7
        );


    let pessoasHoje = 0;

    let ganhoHoje = 0;

    let pessoasMes = 0;

    let ganhoMes = 0;

    let pessoasTotal = 0;

    let ganhoTotal = 0;


    for (
        const chave in dados
    ) {

        const item =
            dados[chave];


        const pessoas =
            Number(
                item.pessoas || 0
            );


        const ganho =
            Number(
                item.ganho || 0
            );


        pessoasTotal +=
            pessoas;


        ganhoTotal +=
            ganho;


        if (
            item.data ===
            hoje
        ) {

            pessoasHoje +=
                pessoas;

            ganhoHoje +=
                ganho;

        }


        if (
            item.data &&
            item.data.startsWith(
                mes
            )
        ) {

            pessoasMes +=
                pessoas;

            ganhoMes +=
                ganho;

        }

    }


    document.getElementById(
        "pessoasHoje"
    ).textContent =
        pessoasHoje;


    document.getElementById(
        "ganhoHoje"
    ).textContent =
        formatarDinheiro(
            ganhoHoje
        );


    document.getElementById(
        "pessoasMes"
    ).textContent =
        pessoasMes;


    document.getElementById(
        "ganhoMes"
    ).textContent =
        formatarDinheiro(
            ganhoMes
        );


    document.getElementById(
        "pessoasTotal"
    ).textContent =
        pessoasTotal;


    document.getElementById(
        "ganhoTotal"
    ).textContent =
        formatarDinheiro(
            ganhoTotal
        );

}


// =====================================
// RESUMO DO FILTRO
// =====================================

function atualizarResumoFiltro(
    registros
) {

    let pessoas = 0;

    let ganho = 0;


    registros.forEach(
        ([chave, item]) => {

            pessoas +=
                Number(
                    item.pessoas || 0
                );


            ganho +=
                Number(
                    item.ganho || 0
                );

        }
    );


    document.getElementById(
        "pessoasFiltro"
    ).textContent =
        pessoas;


    document.getElementById(
        "ganhoFiltro"
    ).textContent =
        formatarDinheiro(
            ganho
        );

}


// =====================================
// FILTRO POR MÊS
// =====================================

filtroMes.addEventListener(
    "change",
    function() {

        carregarRegistros();

    }
);


// =====================================
// LIMPAR FILTRO
// =====================================

window.limparFiltro =
function() {

    filtroMes.value =
        "";

    carregarRegistros();

};


// =====================================
// EDITAR
// =====================================

window.editarRegistro =
async function(chave) {

    try {

        const snapshot =
            await get(
                child(
                    ref(db),
                    `${CAMINHO}/${chave}`
                )
            );


        if (
            !snapshot.exists()
        ) {

            alert(
                "Registro não encontrado."
            );

            return;

        }


        const item =
            snapshot.val();


        dataInput.value =
            item.data || "";


        pessoasInput.value =
            item.pessoas || 0;


        ganhoInput.value =
            item.ganho || 0;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        pessoasInput.focus();


        alert(
            "Os dados foram colocados no formulário. Faça as alterações e clique em Salvar dia."
        );

    }

    catch (erro) {

        console.error(
            erro
        );


        alert(
            "Erro ao editar registro.\n\n" +
            (
                erro.code ||
                erro.message
            )
        );

    }

};


// =====================================
// EXCLUIR
// =====================================

window.excluirRegistro =
async function(chave) {

    const confirmar =
        confirm(
            "Deseja realmente excluir este registro?"
        );


    if (!confirmar) {

        return;

    }


    try {

        await remove(
            ref(
                db,
                `${CAMINHO}/${chave}`
            )
        );


        alert(
            "Registro excluído com sucesso!"
        );


        carregarRegistros();

    }

    catch (erro) {

        console.error(
            erro
        );


        alert(
            "Não foi possível excluir.\n\n" +
            (
                erro.code ||
                erro.message
            )
        );

    }

};


// =====================================
// INICIALIZAÇÃO
// =====================================

dataInput.value =
    dataLocal();


filtroMes.value =
    mesAtual();


carregarRegistros();
