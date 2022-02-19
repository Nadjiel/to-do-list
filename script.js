//Adicao de tarefas

class Tarefa {
    constructor(nome, id, status) {
        this.nome = nome;
        this.id = id;
        this.status = status;
    }

    adicionarALista() {
        const div = document.createElement("div");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = this.id;
        input.onclick = manusearClickEmTarefa;
        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.innerText = this.nome;

        div.appendChild(input);
        div.appendChild(label);
        listaTarefasPendentes.appendChild(div);
    }
}

//Gerenciamento de tarefas
function manusearClickEmTarefa(e) {
    const inputTarefa = e.target;
    const divTarefa = inputTarefa.parentNode;
    let indexTarefaClicada;
    tarefas.forEach((tarefa, index) => {
        if(tarefa.id === inputTarefa.id) {
            indexTarefaClicada = index;
        }
    });
    
    if(inputTarefa.checked) {
        listaTarefasConcluidas.insertBefore(divTarefa, listaTarefasConcluidas.children[0]);
        tarefas[indexTarefaClicada].status = "concluida";
    }
    else {
        listaTarefasConcluidas.removeChild(divTarefa);
        listaTarefasPendentes.appendChild(divTarefa);
        tarefas[indexTarefaClicada].status = "pendente";
    }
}
//--------------------

const listaTarefasPendentes = document.querySelector("#tarefas-pendentes");
const listaTarefasConcluidas = document.querySelector("#tarefas-concluidas");
const novaTarefa = document.querySelector("#adicionar-tarefa input");
const botaoAdicionar = document.querySelector("#adicionar-tarefa button");

const tarefas = [];

botaoAdicionar.onclick = () => {
    if(novaTarefa.value) {
        tarefas.push(new Tarefa(novaTarefa.value, `tarefa${tarefas.length}`, "pendente"));
        tarefas[tarefas.length-1].adicionarALista();
    }
}