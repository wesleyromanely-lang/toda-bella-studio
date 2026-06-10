import { db, ref, push, get, child } from "./firebase.js";

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

if(dataInput){

dataInput.addEventListener("change", async ()=>{

const dataSelecionada = dataInput.value;

horarioSelect.innerHTML = "";

const snapshot = await get(child(ref(db), "agendamentos"));

let ocupados = [];

if(snapshot.exists()){

const dados = snapshot.val();

Object.values(dados).forEach(item=>{

if(item.data === dataSelecionada){
ocupados.push(item.horario);
}

});

}

const livres = horariosFixos.filter(
h => !ocupados.includes(h)
);

livres.forEach(h=>{

const option = document.createElement("option");
option.value = h;
option.textContent = h;

horarioSelect.appendChild(option);

});

});

}

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

const mensagem = `Olá! Novo agendamento no Toda Bella Studio.

Nome: ${nome}
Telefone: ${telefone}
Serviço: ${servico}
Data: ${data}
Horário: ${horario}`;

const urlWhatsapp =
`https://wa.me/5511964201177?text=${encodeURIComponent(mensagem)}`;

window.location.href = urlWhatsapp;

form.reset();

    
