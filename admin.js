import {
  db,
  ref,
  get,
  child,
  remove
} from "./firebase.js";

window.entrar = async function () {

  const senha =
    document.getElementById("senha").value;

  if (senha !== "1234") {

    alert("Senha incorreta");
    return;

  }

  document.getElementById("login").style.display = "none";
  document.getElementById("painel").style.display = "block";

  carregarAgendamentos();

};

async function carregarAgendamentos() {

  const lista =
    document.getElementById("lista");

  lista.innerHTML = "";

  const snapshot =
    await get(child(ref(db), "agendamentos"));

  if (!snapshot.exists()) {

    lista.innerHTML =
      "<p>Nenhum agendamento encontrado.</p>";

    return;

  }

  const dados = snapshot.val();

  let totalAgendamentos = 0;
  let faturamento = 0;

  const pesquisa =
    document.getElementById("pesquisa")
      ? document.getElementById("pesquisa").value.toLowerCase()
      : "";

  for (const chave in dados) {

    const item = dados[chave];

    if (
      pesquisa &&
      !item.nome.toLowerCase().includes(pesquisa)
    ) {
      continue;
    }

    totalAgendamentos++;

    const valor =
      parseFloat(
        item.servico
          .replace(",", ".")
          .match(/(\d+(\.\d+)?)/)?.[0] || 0
      );

    faturamento += valor;

    const dataFormatada =
      item.data.split("-").reverse().join("/");

    const whatsapp =
      `https://wa.me/55${item.telefone}`;

    lista.innerHTML += `

      <div class="card">

        <h3>${item.nome}</h3>

        <p>📞 ${item.telefone}</p>

        <p>💇 ${item.servico}</p>

        <p>📅 ${dataFormatada}</p>

        <p>⏰ ${item.horario}</p>

        <a href="${whatsapp}"
           target="_blank">

          <button>
            WhatsApp
          </button>

        </a>

        <button
          class="excluir"
          onclick="excluirAgendamento('${chave}')">

          Excluir

        </button>

      </div>

    `;

  }

  document.getElementById("total")
    .innerHTML =
    `📅 Agendamentos: ${totalAgendamentos}`;

  document.getElementById("faturamento")
    .innerHTML =
    `💰 Faturamento Previsto: R$ ${faturamento.toFixed(2)}`;

}

window.excluirAgendamento =
  async function (chave) {

    if (
      !confirm(
        "Deseja excluir este agendamento?"
      )
    ) {
      return;
    }

    await remove(
      ref(db, `agendamentos/${chave}`)
    );

    alert("Agendamento excluído!");

    carregarAgendamentos();

  };

window.pesquisarCliente = function () {
  carregarAgendamentos();
};
