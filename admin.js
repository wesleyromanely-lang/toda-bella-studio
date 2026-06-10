import {
db,
ref,
get,
child,
remove
} from "./firebase.js";

window.entrar = async function(){

const senha =
document.getElementById("senha").value;

if(senha !== "1234"){

alert("Senha incorreta");

return;

}

document.getElementById("login").style.display =
"none";

document.getElementById("painel").style.display =
"block";

carregarAgendamentos();

}

async function carregarAgendamentos(){

const lista =
document.getElementById("lista");

lista.innerHTML = "";

const snapshot =
await get(child(ref(db),"agendamentos"));

if(!snapshot.exists()){

lista.innerHTML =
"<p>Nenhum agendamento.</p>";

return;

}

const dados = snapshot.val();

document.getElementById("total")
.innerHTML =
`Total de agendamentos: ${Object.keys(dados).length}`;

for(const chave in dados){

const item = dados[chave];

const dataFormatada =
item.data.split("-").reverse().join("/");

lista.innerHTML += `

<div class="card">

<b>${item.nome}</b><br>

📞 ${item.telefone}<br>

💇 ${item.servico}<br>

📅 ${dataFormatada}<br>

⏰ ${item.horario}<br>

<button
class="excluir"
onclick="excluirAgendamento('${chave}')">

Excluir

</button>

</div>

`;

}

}

window.excluirAgendamento =
async function(chave){

if(!confirm(
"Deseja excluir este agendamento?"
)){
return;
}

await remove(
ref(db,`agendamentos/${chave}`)
);

alert("Agendamento excluído!");

carregarAgendamentos();

}
