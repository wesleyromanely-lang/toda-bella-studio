function gerarCalendarioMensal(){

const calendario =
document.getElementById("calendario");

if(!calendario){
return;
}

calendario.innerHTML = "";

const hoje = new Date();

const ano = hoje.getFullYear();
const mes = hoje.getMonth();

const ultimoDia =
new Date(ano, mes + 1, 0).getDate();

for(let dia = 1; dia <= ultimoDia; dia++){

const data =
`${ano}-${String(mes + 1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;

let ocupados = 0;

for(const chave in todosAgendamentos){

const item = todosAgendamentos[chave];

if(item.data === data){

ocupados++;

}

}

const div =
document.createElement("div");

div.classList.add("dia-calendario");

if(ocupados >= horariosFixos.length){

div.classList.add("dia-lotado");

div.innerHTML =
`🔴<br>${dia}`;

}else{

div.classList.add("dia-livre");

div.innerHTML =
`🟢<br>${dia}`;

}

div.onclick = function(){

document.getElementById("dataAgenda").value =
data;

gerarAgenda(data);

};

calendario.appendChild(div);

}

}
