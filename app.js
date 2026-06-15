import { db, ref, push, get, child } from "./firebase.js";

const form = document.getElementById("agendamentoForm");
const dataInput = document.getElementById("data");
const horarioSelect = document.getElementById("horario");

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

function diaBloqueado(data) {

  const dataSelecionada =
    new Date(data + "T00:00:00");

  const diaSemana =
    dataSelecionada.getDay();

  return diaSemana === 0 || diaSemana === 1;

}


// Bloqueia domingos e segundas

dataInput.addEventListener("change", function () {

  if (diaBloqueado(this.value)) {

    alert(
      "A Toda Bella Studio não atende aos domingos e segundas-feiras."
    );

    this.value = "";

    horarioSelect.innerHTML =
      '<option value="">Selecione uma data válida</option>';

    return;
  }


  carregarHorarios();

});



async function carregarHorarios() {


  const dataSelecionada =
    dataInput.value;


  if (!dataSelecionada) {

    horarioSelect.innerHTML =
      '<option value="">Selecione uma data primeiro</option>';

    return;

  }


  try {


    horarioSelect.innerHTML = "";


    const snapshot =
      await get(child(ref(db), "agendamentos"));


    let ocupados = [];


    if (snapshot.exists()) {


      const dados =
        snapshot.val();


      Object.values(dados).forEach(item => {


        if (item.data === dataSelecionada) {

          ocupados.push(item.horario);

        }

      });


    }



    let horariosDisponiveis =
      [...horariosFixos];


    const hoje =
      new Date();


    const hojeTexto =
      hoje.toISOString().split("T")[0];


    if (dataSelecionada === hojeTexto) {


      const minutosAgora =
        (hoje.getHours() * 60) +
        hoje.getMinutes();



      horariosDisponiveis =
        horariosDisponiveis.filter(horario => {


          const [hora,minuto] =
            horario.split(":").map(Number);


          const minutosHorario =
            (hora * 60) + minuto;


          return minutosHorario > minutosAgora;


        });


    }



    const livres =
      horariosDisponiveis.filter(
        horario => !ocupados.includes(horario)
      );



    if (livres.length === 0) {


      horarioSelect.innerHTML =
        '<option value="">Nenhum horário disponível</option>';


      return;

    }



    livres.forEach(horario => {


      const option =
        document.createElement("option");


      option.value = horario;
      option.textContent = horario;


      horarioSelect.appendChild(option);


    });



  } catch (erro) {


    console.error("Erro:", erro);


    horarioSelect.innerHTML =
      '<option value="">Erro ao carregar horários</option>';


  }


}




form.addEventListener("submit", async (e) => {


  e.preventDefault();



  const nome =
    document.getElementById("nome").value;


  const telefone =
    document.getElementById("telefone").value;


  const servico =
    document.getElementById("servico").value;


  const data =
    document.getElementById("data").value;


  const horario =
    document.getElementById("horario").value;



  if (!horario) {

    alert("Selecione um horário válido.");

    return;

  }



  // Proteção extra

  if (diaBloqueado(data)) {


    alert(
      "Não é possível agendar aos domingos ou segundas."
    );


    return;

  }



  const dataFormatada =
    data.split("-").reverse().join("/");



  try {



    await push(ref(db,"agendamentos"), {


      nome,
      telefone,
      servico,
      data,
      horario,
      criadoEm:
      new Date().toISOString()


    });



    const mensagem =
`NOVO AGENDAMENTO - TODA BELLA STUDIO

Nome: ${nome}
Telefone: ${telefone}
Serviço: ${servico}
Data: ${dataFormatada}
Horário: ${horario}`;



    const whatsapp =
    `https://wa.me/5511964201177?text=${encodeURIComponent(mensagem)}`;



    alert(
      "Agendamento realizado com sucesso!"
    );



    window.location.href =
      whatsapp;



  } catch (erro) {


    console.error(erro);


    alert(
      "Erro ao salvar agendamento."
    );


  }


});
