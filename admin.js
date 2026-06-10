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

const dados = snapshot.val();

let totalAgendamentos = 0;
let faturamento = 0;
let faturamentoHoje = 0;
let agendamentosHoje = 0;
let agendamentosAmanha = 0;

const hoje = new Date();
const hojeTexto =
hoje.toISOString().split("T")[0];

const amanha = new Date();
amanha.setDate(amanha.getDate() + 1);

const amanhaTexto =
amanha.toISOString().split("T")[0];

const pesquisa =
document.getElementById("pesquisa")
? document.getElementById("pesquisa").value.toLowerCase()
: "";

let ocupadosHoje = [];

for (const chave in dados) {

const item = dados[chave];

if (
pesquisa &&
!item.nome.toLowerCase().includes(pesquisa)
) {
continue;
}

let valor = 0;

if (item.servico.includes("120"))
valor = 120;
else if (item.servico.includes("99"))
valor = 99;
else if (item.servico.includes("79"))
valor = 79.99;
else if (item.servico.includes("69"))
valor = 69.99;
else if (item.servico.includes("50"))
valor = 50;

faturamento += valor;

if(item.data === hojeTexto){

agendamentosHoje++;
faturamentoHoje += valor;

ocupadosHoje.push({
horario:item.horario,
nome:item.nome
});

}

if(item.data === amanhaTexto){

agendamentosAmanha++;

}

totalAgendamentos++;

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

document.getElementById("hoje").innerHTML =
`📅 Hoje: ${agendamentosHoje}`;

document.getElementById("amanha").innerHTML =
`📅 Amanhã: ${agendamentosAmanha}`;

document.getElementById("faturamentoHoje").innerHTML =
`💰 Hoje: R$ ${faturamentoHoje.toFixed(2)}`;

document.getElementById("faturamento").innerHTML =
`💰 Total: R$ ${faturamento.toFixed(2)}`;

let agendaHTML = "";

horariosFixos.forEach(horario => {

const ocupado =
ocupadosHoje.find(
item => item.horario === horario
);

if(ocupado){

agendaHTML += `

<p>
❌ ${horario} - ${ocupado.nome}
</p>
`;

}else{

agendaHTML += `

<p>
✅ ${horario} - Livre
</p>
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
