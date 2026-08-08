import {
    db,
    auth,
    ref,
    push,
    get,
    child,
    remove,
    update,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "./firebase.js";


// =====================================
// CONFIGURAÇÕES
// =====================================

const CAMINHO = "controleFinanceiro";


// =====================================
// ELEMENTOS
// =====================================

const login =
    document.getElementById("login");

const painel =
    document.getElementById("painel");

const senha =
    document.getElementById("senha");

const erroLogin =
    document.getElementById("erroLogin");

const formRegistro =
    document.getElementById("formRegistro");

const dataInput =
    document.getElementById("data");

const pessoasInput =
    document.getElementById("pessoas");

const ganhoInput =
    document.getElementById("ganho");

const listaRegistros =
    document.getElementById("listaRegistros");

const filtroMes =
    document.getElementById("filtroMes");


// =====================================
// E-MAIL DO ADMIN
// =====================================
//
// IMPORTANTE:
// coloque aqui o MESMO e-mail que você
// cadastrou no Firebase Authentication.
//
// Exemplo:
//
// const EMAIL_ADMIN = "seuemail@gmail.com";
//
// NÃO coloque sua senha aqui.
//

const EMAIL_ADMIN = "COLOQUE_SEU_EMAIL_AQUI";


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
// LOGIN FIREBASE
// =====================================

window.entrar =
async function () {

    const email =
        EMAIL_ADMIN.trim();

    const password =
        senha.value.trim();


    erroLogin.textContent =
        "";


    if (
        !email ||
        email ===
        "COLOQUE_SEU_EMAIL_AQUI"
    ) {

        erroLogin.textContent =
            "Configure o e-mail do administrador no admin.js.";

        return;

    }


    if (!password) {

        erroLogin.textContent =
            "Digite sua senha.";

        senha.focus();

        return;

    }


    const botao =
        login.querySelector(
            "button"
        );


    if (botao) {

        botao.disabled =
            true;

        botao.textContent =
            "Entrando...";

    }


    try {

        const resultado =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        if (
            resultado.user.email
                .toLowerCase() !==
            email.toLowerCase()
        ) {

            await signOut(
                auth
            );

            throw new Error(
                "Usuário não autorizado."
            );

        }


        senha.value =
            "";


        mostrarPainel();


    }

    catch (erro) {

        console.error(
            "Erro no login:",
            erro
        );


        let mensagem =
            "Não foi possível entrar.";


        if (
            erro.code ===
            "auth/invalid-credential"
        ) {

            mensagem =
                "E-mail ou senha incorretos.";

        }

        else if (
            erro.code ===
            "auth/invalid-email"
        ) {

            mensagem =
                "O e-mail do administrador é inválido.";

        }

        else if (
            erro.code ===
            "auth/too-many-requests"
        ) {

            mensagem =
                "Muitas tentativas. Aguarde um pouco e tente novamente.";

        }

        else if (
            erro.code ===
            "auth/network-request-failed"
        ) {

            mensagem =
                "Verifique sua conexão com a internet.";

        }

        else if (
            erro.message ===
            "Usuário não autorizado."
        ) {

            mensagem =
                "Usuário não autorizado.";

        }


        erroLogin.textContent =
            mensagem;

    }

    finally {

        if (botao) {

            botao.disabled =
                false;

            botao.textContent =
                "🔐 Entrar";

        }

    }

};


// =====================================
// MOSTRAR PAINEL
// =====================================

function mostrarPainel() {

    login.style.display =
        "none";


    painel.style.display =
        "block";


    dataInput.value =
        dataLocal();


    filtroMes.value =
        mesAtual();


    carregarRegistros();

}


// =====================================
// ESCONDER PAINEL
// =====================================

function esconderPainel() {

    painel.style.display =
        "none";


    login.style.display =
        "flex";


    senha.value =
        "";


    erroLogin.textContent =
        "";

}


// =====================================
// SAIR
// =====================================

window.sair =
async function () {

    try {

        await signOut(
            auth
        );

        esconderPainel();

    }

    catch (erro) {

        console.error(
            "Erro ao sair:",
            erro
        );

        alert(
            "Não foi possível sair."
        );

    }

};


// =====================================
// VERIFICAR AUTENTICAÇÃO
// =====================================

onAuthStateChanged(
    auth,
    function (user) {

        if (!user) {

            esconderPainel();

            return;

        }


        if (
            !user.email ||
            user.email.toLowerCase() !==
            EMAIL_ADMIN.toLowerCase()
        ) {

            signOut(
                auth
            );

            esconderPainel();

            erroLogin.textContent =
                "Usuário não autorizado.";

            return;

        }


        mostrarPainel();

    }
);


// =====================================
// SALVAR REGISTRO
// =====================================

formRegistro.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // Garantir que existe usuário autenticado

        if (!auth.currentUser) {

            alert(
                "Sua sessão expirou. Entre novamente."
            );

            esconderPainel();

            return;

        }


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


        if (!data) {

            alert(
                "Selecione uma data."
            );

            return;

        }


        if (
            !Number.isInteger(
                pessoas
            ) ||
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


        const btn =
            document.getElementById(
                "btnSalvar"
            );


        btn.disabled =
            true;


        btn.textContent =
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


            let registroExistente =
                null;


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

                        registroExistente = {

                            chave: chave,

                            dados:
                                dados[chave]

                        };


                        break;

                    }

                }

            }


            // =================================
            // ATUALIZAR EXISTENTE
            // =================================

            if (
                registroExistente
            ) {

                const confirmar =
                    confirm(
                        `Já existe um registro para ${formatarData(data)}.\n\n` +
                        `Pessoas atuais: ${registroExistente.dados.pessoas}\n` +
                        `Ganho atual: ${formatarDinheiro(registroExistente.dados.ganho)}\n\n` +
                        `Deseja substituir pelos novos valores?`
                    );


                if (
                    !confirmar
                ) {

                    btn.disabled =
                        false;

                    btn.textContent =
                        "💾 Salvar dia";

                    return;

                }


                await update(
                    ref(
                        db,
                        `${CAMINHO}/${registroExistente.chave}`
                    ),
                    {
                        data:
                            data,

                        pessoas:
                            pessoas,

                        ganho:
                            ganho
                    }
                );


                alert(
                    "Registro atualizado com sucesso! 🌸"
                );

            }

            // =================================
            // NOVO REGISTRO
            // =================================

            else {

                await push(
                    registrosRef,
                    {

                        data:
                            data,

                        pessoas:
                            pessoas,

                        ganho:
                            ganho

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


            if (
                erro.code ===
                "PERMISSION_DENIED"
            ) {

                alert(
                    "O Firebase bloqueou o acesso. Ainda precisamos atualizar as regras de segurança."
                );

            }

            else if (
                erro.code ===
                "auth/user-token-expired"
            ) {

                alert(
                    "Sua sessão expirou. Entre novamente."
                );

                esconderPainel();

            }

            else {

                alert(
                    "Não foi possível salvar o registro."
                );

            }

        }

        finally {

            btn.disabled =
                false;

            btn.textContent =
                "💾 Salvar dia";

        }

    }
);


// =====================================
// CARREGAR REGISTROS
// =====================================

window.carregarRegistros =
async function () {

    if (!auth.currentUser) {

        return;

    }


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


        if (
            !snapshot.exists()
        ) {

            listaRegistros.innerHTML = `
                <div class="vazio">

                    <div>
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
            "Erro ao carregar registros:",
            erro
        );


        if (
            erro.code ===
            "PERMISSION_DENIED"
        ) {

            listaRegistros.innerHTML = `
                <div class="erro-box">
                    🔒 O Firebase bloqueou o acesso.
                    <br><br>
                    Precisamos configurar as regras de segurança.
                </div>
            `;

        }

        else {

            listaRegistros.innerHTML = `
                <div class="erro-box">
                    ❌ Erro ao carregar os registros.
                </div>
            `;

        }

    }

};


// =====================================
// RENDERIZAR HISTÓRICO
// =====================================

function renderizarHistorico(
    dados
) {

    listaRegistros.innerHTML =
        "";


    const filtro =
        filtroMes.value;


    const registros =
        Object.entries(dados)
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

                <div>
                    📅
                </div>

                <strong>
                    Nenhum registro encontrado
                </strong>

                <p>
                    Não há registros para o período selecionado.
                </p>

            </div>
        `;

        return;

    }


    registros.forEach(
        ([chave, item]) => {

            const data =
                item.data || "";


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

                    <span>
                        📅
                    </span>

                    <div>

                        <strong>
                            ${formatarData(data)}
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
                        title="Editar"
                    >
                        ✏️
                    </button>


                    <button
                        class="btn-excluir"
                        onclick="excluirRegistro('${chave}')"
                        title="Excluir"
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


    let pessoasHoje =
        0;


    let ganhoHoje =
        0;


    let pessoasMes =
        0;


    let ganhoMes =
        0;


    let pessoasTotal =
        0;


    let ganhoTotal =
        0;


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

    let pessoas =
        0;


    let ganho =
        0;


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
// FILTRO DE MÊS
// =====================================

filtroMes.addEventListener(
    "change",
    function () {

        carregarRegistros();

    }
);


// =====================================
// LIMPAR FILTRO
// =====================================

window.limparFiltro =
function () {

    filtroMes.value =
        "";


    carregarRegistros();

};


// =====================================
// EDITAR REGISTRO
// =====================================

window.editarRegistro =
async function (chave) {

    if (!auth.currentUser) {

        alert(
            "Sua sessão expirou."
        );

        esconderPainel();

        return;

    }


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
            "Edite os dados acima e clique em Salvar dia."
        );

    }

    catch (erro) {

        console.error(
            erro
        );


        alert(
            "Erro ao abrir o registro."
        );

    }

};


// =====================================
// EXCLUIR REGISTRO
// =====================================

window.excluirRegistro =
async function (chave) {

    if (!auth.currentUser) {

        alert(
            "Sua sessão expirou."
        );

        esconderPainel();

        return;

    }


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
            "Registro excluído!"
        );


        carregarRegistros();

    }

    catch (erro) {

        console.error(
            "Erro ao excluir:",
            erro
        );


        alert(
            "Não foi possível excluir o registro."
        );

    }

};


// =====================================
// ENTER NO LOGIN
// =====================================

senha.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Enter"
        ) {

            entrar();

        }

    }
);


// =====================================
// INÍCIO
// =====================================

painel.style.display =
    "none";


dataInput.value =
    dataLocal();


filtroMes.value =
    mesAtual();
