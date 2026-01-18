// ===============================
// CARREGAR FREELANCERS (JSON)
// ===============================
let dados = {};

fetch('freelancers.json')
    .then(res => res.json())
    .then(json => dados = json)
    .catch(err => console.error("Erro ao carregar freelancers:", err));


// ===============================
// PROTEÇÃO DA PÁGINA SERVIÇOS
// ===============================
if (window.location.pathname.includes("servicos.html")) {
    if (localStorage.getItem("logado") !== "true") {
        window.location.href = "login.html";
    }
}


// ===============================
// MOSTRAR PROFISSIONAIS
// ===============================
function mostrarServico(servico) {
    const container = document.getElementById("jobs");
    const section = document.getElementById("profissionais");

    if (!container || !section) return;

    container.innerHTML = "";

    if (!dados[servico] || dados[servico].length === 0) {
        container.innerHTML = "<p>Nenhum profissional disponível.</p>";
    } else {
        dados[servico].forEach(p => {
            container.innerHTML += `
                <div class="job-card">
                    <h5>${p.nome}</h5>
                    <p>
                        Experiência: ${p.experiencia}<br>
                        Valor: ${p.valor}<br>
                        Bairro: ${p.bairro}
                    </p>
                    <button class="job-card-button"
                        onclick="contatoWhats('${p.nome}', '${p.bairro}', '${servico}')">
                        WhatsApp
                    </button>
                </div>
            `;
        });
    }

    section.classList.remove("hidden");
}


// ===============================
// WHATSAPP
// ===============================
function contatoWhats(nomeFreela, bairroFreela) {
    const numeroTaskUp = "5531992111470";
    const emailLogado = localStorage.getItem("usuarioLogado");
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
    const usuario = usuarios[emailLogado];

    if (!usuario) {
        alert("Usuário não identificado");
        return;
    }

    let dadosContratante = "";

    if (usuario.tipo === "empresa") {
        dadosContratante = `
Empresa: localStorage.getItem("usuarioLogado")
CNPJ: ${usuario.cnpj}
Email: ${usuario.email}
Telefone: ${usuario.telefone}
        `;
    } else {
        dadosContratante = `
Nome: localStorage.getItem("usuarioLogado")
CPF: ${usuario.cpf}
Email: ${usuario.email}
Telefone: ${usuario.telefone}
        `;
    }

    const msg = `Olá! Encontrei um profissional no site TaskUp e gostaria de solicitar um serviço.

📌 Profissional: ${nomeFreela}
📍 Bairro: ${bairroFreela}

📄 Dados do contratante:
${dadosContratante}`;

    window.open(
        `https://wa.me/${numeroTaskUp}?text=${encodeURIComponent(msg)}`,
        "_blank"
    );
}


// ===============================
// REGISTRO DE EMPRESA
// ===============================
function registrar() {
    const tipo = document.getElementById("tipo").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (!tipo || !email || !senha) {
        alert("Preencha todos os campos obrigatórios");
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};
    let chaveUsuario = "";
    let usuario = { tipo, email, senha };

    if (tipo === "empresa") {
        usuario.empresa = document.getElementById("empresa").value;
        usuario.cnpj = document.getElementById("cnpj").value;
        usuario.telefone = document.getElementById("telefoneEmpresa").value;

        if (!usuario.empresa || !usuario.cnpj || !usuario.telefone) {
            alert("Preencha todos os dados da empresa");
            return;
        }

        chaveUsuario = usuario.empresa
            .toLowerCase()
            .replace(/\s+/g, "_");
    }

    if (tipo === "pessoa") {
        usuario.nome = document.getElementById("nome").value;
        usuario.cpf = document.getElementById("cpf").value;
        usuario.telefone = document.getElementById("telefonePessoa").value;

        if (!usuario.nome || !usuario.cpf || !usuario.telefone) {
            alert("Preencha todos os dados pessoais");
            return;
        }

        chaveUsuario = usuario.nome
            .toLowerCase()
            .replace(/\s+/g, "_");
    }

    if (usuarios[chaveUsuario]) {
        alert("Já existe um usuário com esse nome");
        return;
    }

    usuarios[chaveUsuario] = usuario;

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
}

// ===============================
// LOGIN
// ===============================
function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

    for (let chave in usuarios) {
        const user = usuarios[chave];

        if (user.email === email && user.senha === senha) {
            localStorage.setItem("logado", "true");
            localStorage.setItem("usuarioLogado", chave);
            window.location.href = "servicos.html";
            return;
        }
    }

    alert("Email ou senha incorretos");
}

// ===============================
// LOGOUT
// ===============================
function logout() {
    localStorage.removeItem("logado");
    localStorage.removeItem("usuarioLogado");
    window.location.href = "login.html";
}

// ===============================
// TROCAR PESSOA FISICA / PESSOA JURIDICA
// ===============================
function trocarTipo() {
    const tipo = document.getElementById("tipo").value;

    document.getElementById("empresaCampos").style.display = "none";
    document.getElementById("pessoaCampos").style.display = "none";

    if (tipo === "empresa") {
        document.getElementById("empresaCampos").style.display = "block";
    }

    if (tipo === "pessoa") {
        document.getElementById("pessoaCampos").style.display = "block";
    }
}

function mostrarUsuarioLogado() {
    const chave = localStorage.getItem("usuarioLogado");
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

    if (!chave || !usuarios[chave]) return;

    const usuario = usuarios[chave];
    let nome = "";

    if (usuario.tipo === "empresa") {
        nome = usuario.empresa;
    } else {
        nome = usuario.nome;
    }

    const span = document.getElementById("nomeUsuario");
    if (span) {
        span.textContent = nome;
    }
}

document.addEventListener("DOMContentLoaded", mostrarUsuarioLogado);
