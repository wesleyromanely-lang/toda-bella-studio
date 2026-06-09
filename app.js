import { db, ref, push } from "./firebase.js";

const form = document.getElementById("agendamentoForm");

if (form) {

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const servico = document.getElementById("servico").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;

    try {

      await push(ref(db, "agendamentos"), {
        nome,
        telefone,
        servico,
        data,
        horario,
        criadoEm: new Date().toISOString()
      });

      alert("Agendamento realizado com sucesso!");

      form.reset();

    } catch (erro) {

      alert("Erro ao salvar agendamento.");
      console.error(erro);

    }

  });

}
