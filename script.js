let servicoEscolhido = "";

let diaEscolhido = "";

let horarioEscolhido = "";


// TESTE DE HORÁRIOS OCUPADOS
// depois vamos trocar pelo Firebase

let horariosOcupados = [

"10:30",

"15:30"

];





const diasSemana = [

"Dom",
"Seg",
"Ter",
"Qua",
"Qui",
"Sex",
"Sáb"

];








function abrirAgendamento(servico){



if(servico){


servicoEscolhido = servico;



document.getElementById("tituloServico").innerHTML =

"✨ " + servico;



}




document
.getElementById("home")
.classList.add("sair");




setTimeout(()=>{



document
.getElementById("home")
.classList.add("escondida");



document
.getElementById("agenda")
.classList.remove("escondida");



criarCalendario();



bloquearHorarios();



},300);



}









function voltar(){



document
.getElementById("agenda")
.classList.add("sair");



setTimeout(()=>{


document
.getElementById("agenda")
.classList.add("escondida");



document
.getElementById("home")
.classList.remove("escondida");



},300);



}









function criarCalendario(){



let area = document.getElementById("dias");



area.innerHTML = "";



let hoje = new Date();




for(let i=1;i<=7;i++){



let data = new Date();



data.setDate(
hoje.getDate()+i
);




let botao = document.createElement("button");




botao.innerHTML =

diasSemana[data.getDay()]

+
"<br>"
+
data.getDate();





botao.onclick=function(){



document
.querySelectorAll(".dias button")
.forEach(b=>{

b.classList.remove("selecionado");

});




botao.classList.add("selecionado");




diaEscolhido =

diasSemana[data.getDay()]

+
" "
+
data.getDate();





atualizarResumo();



}




area.appendChild(botao);



}




}









function hora(botao,valor){



if(
horariosOcupados.includes(valor)

){


alert("Esse horário já está ocupado");


return;


}






horarioEscolhido = valor;





document
.querySelectorAll(".horarios button")
.forEach(b=>{


b.classList.remove("selecionado");


});






botao.classList.add("selecionado");





atualizarResumo();




}









function bloquearHorarios(){



document
.querySelectorAll(".horarios button")
.forEach(botao=>{



let horario =
botao.innerText;




if(
horariosOcupados.includes(horario)

){



botao.disabled = true;



botao.classList.add("ocupado");



}



});



}









function atualizarResumo(){



document.getElementById("resumo").innerHTML =




`

Serviço:

<br>

<b>${servicoEscolhido}</b>


<br><br>


Dia:

<br>

<b>${diaEscolhido}</b>


<br><br>


Horário:

<br>

<b>${horarioEscolhido}</b>



`;





}










function confirmar(){



let nome =

document.getElementById("nome").value;



let whatsapp =

document.getElementById("whatsapp").value;







if(
!servicoEscolhido ||
!diaEscolhido ||
!horarioEscolhido

){



alert("Escolha serviço, dia e horário");


return;


}







if(
!nome ||
!whatsapp

){


alert("Preencha seus dados");


return;


}







document
.getElementById("btnWhatsapp")
.style.display="block";







document.getElementById("resumo").innerHTML =




`

<h2>
✅ Agendamento confirmado
</h2>


Cliente:

<b>${nome}</b>


<br><br>


Serviço:

<b>${servicoEscolhido}</b>


<br><br>


Dia:

<b>${diaEscolhido}</b>


<br><br>


Horário:

<b>${horarioEscolhido}</b>


`;







}









function whatsapp(){





let numero =

"5511999999999";





let mensagem =



`

Olá Toda Bella ✨


Quero confirmar meu agendamento.


Cliente:
${document.getElementById("nome").value}


Serviço:
${servicoEscolhido}


Dia:
${diaEscolhido}


Horário:
${horarioEscolhido}


`;







window.open(

"https://wa.me/"

+
numero
+
"?text="
+
encodeURIComponent(mensagem)

);



}
