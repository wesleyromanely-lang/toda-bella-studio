import {
db,
ref,
get,
child,
remove
} from "./firebase.js";

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

let todosAgendamentos = {};

window.entrar = async function () {

const senha =
document.getElementById("senha").value;

if (senha !== "1234") {

alert("Senha incorreta");
return;

}

document.getElementById("login").style.display =
"none";

document.getElementById("painel").style.display =
"block";

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

todosAgendamentos = snapshot.val();

let faturamento = 0;
let faturamentoHoje = 0;
let agendamentosHoje = 0;
let agendamentosAmanha = 0;

let clientesMes = 0;
let faturamentoMes = 0;

const servicosContador = {};

const hoje = new Date();
const hojeTexto =
hoje.toISOString().split("T")[0];

const mesAtual =
hojeTexto.substring(0,7);

const amanha = new Date();
amanha.setDate(amanha.getDate() + 1);

const amanhaTexto =
amanha.toISOString().split("T")[0];

const pesquisa =
document.getElementById("pesquisa")
? document.getElementById("pesquisa").value.toLowerCase()
: "";

for (const chave in todosAgendamentos) {

const item = todosAgendamentos[chave];

let valor = 0;

if (item.servico.includes("120")) valor = 120;
else if (item.servico.includes("99")) valor = 99;
else if (item.servico.includes("79")) valor = 79.99;
else if (item.servico.includes("69")) valor = 69.99;
else if (item.servico.includes("50")) valor = 50;

faturamento += valor;

if(item.data === hojeTexto){

agendamentosHoje++;
faturamentoHoje += valor;

}

if(item.data === amanhaTexto){

agendamentosAmanha++;

}

if(item.data.startsWith(mesAtual)){

clientesMes++;
faturamentoMes += valor;

servicosContador[item.servico] =
(servicosContador[item.servico] || 0) + 1;

}

if (
pesquisa &&
!item.nome.toLowerCase().includes(pesquisa)
) {
continue;
}

const dataFormatada =
item.data.split("-").reverse().join("/");

const whatsapp =
`https://wa.me/55${item.telefone}`;

const mensagemConfirmacao =
`Olá ${item.nome}!

Seu horário está confirmado no Toda Bella Studio 🌸

📅 Data: ${dataFormatada}
⏰ Horário: ${item.horario}

Aguardamos você!`;

const confirmar =
`https://wa.me/55${item.telefone}?text=${encodeURIComponent(mensagemConfirmacao)}`;

lista.innerHTML += `

<div class="card">

<h3>${item.nome}</h3>

<p>📞 ${item.telefone}</p>

<p>💇 ${item.servico}</p>

<p>📅 ${dataFormatada}</p>

<p>⏰ ${item.horario}</p>

<a href="${whatsapp}" target="_blank">
<button class="whatsapp">
WhatsApp
</button>
</a>

<a href="${confirmar}" target="_blank">
<button class="confirmar">
✅ Confirmar Atendimento
</button>
</a>

<button
class="excluir"
onclick="excluirAgendamento('${chave}')">

🗑️ Excluir

</button>

</div>

`;

}

let servicoMaisVendido = "-";
let maior = 0;

for(const servico in servicosContador){

if(servicosContador[servico] > maior){

maior = servicosContador[servico];
servicoMaisVendido = servico;

}

}

document.getElementById("hoje").innerHTML =
`📅 Hoje: ${agendamentosHoje}`;

document.getElementById("amanha").innerHTML =
`📅 Amanhã: ${agendamentosAmanha}`;

document.getElementById("faturamentoHoje").innerHTML =
`💰 Hoje: R$ ${faturamentoHoje.toFixed(2)}`;

document.getElementById("faturamento").innerHTML =
`💰 Total: R$ ${faturamento.toFixed(2)}`;

document.getElementById("clientesMes").innerHTML =
`👩 Clientes: ${clientesMes}`;

document.getElementById("faturamentoMes").innerHTML =
`💰 Faturamento Mensal: R$ ${faturamentoMes.toFixed(2)}`;

document.getElementById("servicoMaisVendido").innerHTML =
`⭐ Serviço Mais Vendido: ${servicoMaisVendido}`;

mostrarAgendaHoje();

}

function mostrarAgendaHoje(){

const hoje =
new Date().toISOString().split("T")[0];

gerarAgenda(hoje);

}

window.mostrarAgendaData = function(){

const data =
document.getElementById("dataAgenda").value;

if(!data){

alert("Selecione uma data");
return;

}

gerarAgenda(data);

};

function gerarAgenda(dataSelecionada){

let ocupados = [];

for (const chave in todosAgendamentos){

const item = todosAgendamentos[chave];

if(item.data === dataSelecionada){

ocupados.push({
horario:item.horario,
nome:item.nome
});

}

}

let agendaHTML = "";

const dataFormatada =
dataSelecionada.split("-").reverse().join("/");

agendaHTML += `
<h3>📅 ${dataFormatada}</h3>
`;

horariosFixos.forEach(horario => {

const ocupado =
ocupados.find(
item => item.horario === horario
);

if(ocupado){

agendaHTML += `
<div class="ocupado">
🔴 ${horario}<br>
${ocupado.nome}
</div>
`;

}else{

agendaHTML += `
<div class="livre">
🟢 ${horario} - Livre
</div>
`;

}

});

document.getElementById("agenda").innerHTML =
agendaHTML;

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
