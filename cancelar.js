import {
  db,
  ref,
  get,
  child,
  remove
} from "./firebase.js";

const form = document.getElementById("cancelamentoForm");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  try {

    const snapshot = await get(
      child(ref(db), "agendamentos")
    );

    if (!snapshot.exists()) {

      alert("Nenhum agendamento encontrado.");
      return;

    }

    const dados = snapshot.val();

    let encontrado = false;

    for (const data in dados) {

      const agendamentosDoDia = dados[data];

      for (const chave in agendamentosDoDia) {

        const agendamento = agendamentosDoDia[chave];

        if (
          agendamento.nome?.trim().toLowerCase() === nome.toLowerCase()
          &&
          agendamento.telefone?.trim() === telefone
        ) {

          await remove(
            ref(db, `agendamentos/${data}/${chave}`)
          );

          const mensagem = `CANCELAMENTO - TODA BELLA STUDIO

Nome: ${agendamento.nome}
Telefone: ${agendamento.telefone}
Serviço: ${agendamento.servico}

Data: ${agendamento.data}
Horário: ${agendamento.horario}

O agendamento foi cancelado pelo site.`;

          const whatsapp =
            `https://wa.me/5511964201177?text=${encodeURIComponent(mensagem)}`;

          alert("Agendamento cancelado com sucesso!");

          window.location.href = whatsapp;

          encontrado = true;

          break;

        }

      }

      if (encontrado) break;

    }

    if (!encontrado) {

      alert(
        "Agendamento não encontrado. Verifique os dados informados."
      );

    }

  } catch (erro) {

    console.error(erro);

    alert("Erro ao cancelar agendamento.");

  }

});
