const listaTarefasPendentes = document.querySelector("#tarefas-pendentes");
const nomeTarefa = document.querySelector("#adicionar-tarefa input");
const botaoAdicionar = document.querySelector("#adicionar-tarefa button");

const tarefas = [];

botaoAdicionar.onclick = () => {
    if(nomeTarefa.value) {
        tarefas.push(nomeTarefa.value.toLowerCase());

        const div = document.createElement("div");
        const input = document.createElement("input");
        input.type = "checkbox";
        input.id = (tarefas.length - 1).toString();
        const label = document.createElement("label");
        label.htmlFor = input.id;
        label.innerText = nomeTarefa.value;

        div.appendChild(input);
        div.appendChild(label);

        listaTarefasPendentes.appendChild(div);
    }
}