// ===============================
// SUPABASE
// ===============================
const supabaseUrl = "https://bfynkxmdsydbmkdttdok.supabase.co";
const supabaseKey = "SUA_ANON_KEY_AQUI";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ===============================
// INIT GLOBAL
// ===============================
document.addEventListener("DOMContentLoaded", async () => {

    const path = window.location.pathname;

    if (path.includes("servicos.html")) {
        await protegerPagina();
    }

    if (path.includes("index.html") || path.endsWith("/")) {
        mostrarUsuarioIndex();
    }
});

// ===============================
// LOGIN
// ===============================
async function login() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha
    });

    if (error) {
        alert("Email ou senha inválidos");
        return;
    }

    window.location.href = "servicos.html";
}

// ===============================
// REGISTRO
// ===============================
async function registrar() {
    const tipo = document.getElementById("tipo").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (!tipo || !email || !senha) {
        alert("Preencha todos os campos");
        return;
    }

    let metadata = { tipo };

    if (tipo === "empresa") {
        metadata.empresa = document.getElementById("empresa").value;
        metadata.cnpj = document.getElementById("cnpj").value;
        metadata.telefone = document.getElementById("telefoneEmpresa").value;
    } else {
        metadata.nome = document.getElementById("nome").value;
        metadata.cpf = document.getElementById("cpf").value;
        metadata.telefone = document.getElementById("telefonePessoa").value;
    }

    const { error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { data: metadata }
    });

    if (error) {
        alert(error.message);
        return;
    }

    alert("Cadastro realizado! Faça login.");
    window.location.href = "login.html";
}

// ===============================
// LOGOUT
// ===============================
async function logout() {
    await supabase.auth.signOut();
    window.location.href = "login.html";
}

// ===============================
// PROTEGER SERVIÇOS
// ===============================
async function protegerPagina() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
        window.location.replace("login.html");
        return;
    }

    const nome =
        data.user.user_metadata?.empresa ||
        data.user.user_metadata?.nome ||
        "Usuário";

    const span = document.getElementById("nomeUsuario");
    if (span) span.textContent = nome;

    document.documentElement.style.display = "block";
}

// ===============================
// INDEX – MOSTRAR USUÁRIO
// ===============================
async function mostrarUsuarioIndex() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) return;

    const nome =
        data.user.user_metadata?.empresa ||
        data.user.user_metadata?.nome ||
        "Usuário";

    const box = document.getElementById("userBox");
    const span = document.getElementById("nomeUsuario");

    if (box && span) {
        span.textContent = nome;
        box.style.display = "block";
    }
}

// ===============================
// REGISTRO – TROCAR TIPO
// ===============================
function trocarTipo() {
    document.getElementById("empresaCampos").style.display = "none";
    document.getElementById("pessoaCampos").style.display = "none";

    const tipo = document.getElementById("tipo").value;

    if (tipo === "empresa") {
        document.getElementById("empresaCampos").style.display = "block";
    }

    if (tipo === "pessoa") {
        document.getElementById("pessoaCampos").style.display = "block";
    }
}