let input = document.querySelector("input");
let addTarefa = document.getElementById('add-tarefa');
let ul = document.querySelector('.lista-de-tarefas');

// --- Funções auxiliares ---
function salvarTarefas() {
    const tarefas = [];
    ul.querySelectorAll("li").forEach(li => {
        // pega apenas o texto (sem o ícone)
        tarefas.push(li.firstChild.textContent.trim());
    });
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    tarefas.forEach(valor => {
        criarLi(valor);
    });
}

function criarLi(valor) {
    const li = document.createElement('li');
    li.classList.add('tarefas', 'nova-tarefa');

    const texto = document.createTextNode(valor + " ");
    const icone = document.createElement('i');
    icone.classList.add('lixeira', 'fa-regular', 'fa-trash-can');

    li.appendChild(texto);
    li.appendChild(icone);



    // torna o li arrastável
    li.setAttribute("draggable", "true");

    ul.appendChild(li);
}

// --- Adicionar tarefa ---
addTarefa.addEventListener("click", function (e) {
    e.preventDefault();

    const valor = input.value.trim();
    if (!valor) return;

    criarLi(valor);
    salvarTarefas();

    input.value = "";
});

// --- Remover tarefa ---
ul.addEventListener("click", function (e) {
    if (e.target.classList.contains('lixeira')) {
        e.target.parentElement.remove();
        salvarTarefas();
    }
});

// --- Drag & Drop ---
// --- Drag & Drop ---
let draggedItem = null;
let placeholder = document.createElement("li");
placeholder.className = "placeholder";

// estilo visual do placeholder
const style = document.createElement("style");
style.textContent = `
  .placeholder {
    background: #ddd;
    height: 2em;
    border: 2px dashed #aaa;
    margin: 4px 0;
  }
`;
document.head.appendChild(style);

ul.addEventListener("dragstart", function (e) {
  if (e.target.tagName === "LI") {
    draggedItem = e.target;
    e.dataTransfer.effectAllowed = "move";

    // já remove o item e coloca o placeholder
    setTimeout(() => {
      ul.insertBefore(placeholder, draggedItem.nextSibling);
      ul.removeChild(draggedItem);
    }, 0);
  }
});

ul.addEventListener("dragover", function (e) {
  e.preventDefault(); // necessário para permitir o drop
  const target = e.target;
  if (target.tagName === "LI" && target !== placeholder) {
    const rect = target.getBoundingClientRect();
    const next = (e.clientY - rect.top) > rect.height / 2;
    ul.insertBefore(placeholder, next ? target.nextSibling : target);
  }
});

ul.addEventListener("drop", function (e) {
  e.preventDefault();
  if (draggedItem) {
    ul.insertBefore(draggedItem, placeholder);
    ul.removeChild(placeholder);
    draggedItem.classList.remove("nova-tarefa");

    draggedItem = null;
    salvarTarefas(); // salva nova ordem
  }
});

// --- Carregar tarefas ao abrir a página ---
carregarTarefas();