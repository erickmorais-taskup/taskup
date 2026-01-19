// ===============================
// SUPABASE CONFIG
// ===============================
const SUPABASE_URL = "https://bfynkxmdsydbmkdttdok.supabase.co";
const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeW5reG1kc3lkYm1rZHR0ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MTQ3NzEsImV4cCI6MjA4NDI5MDc3MX0.Dvbijztg4bHPcxgjVhpfGcAfwNJrbv2CsuGktG9nqyg";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

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

    const { data, error } = await supabase.auth.signUp({
        email,
        password: senha
    });

    if (error) {
        alert(error.message);
        return;
    }

    const userId = data.user.id;

    let payload = {
        id: userId,
        tipo,
        email
    };

    if (tipo === "empresa") {
        payload.empresa = document.getElementById("empresa").value;
        payload.cnpj = document.getElementById("cnpj").value;
        payload.telefone = document.getElementById("telefoneEmpresa").value;
    } else {
        payload.nome = document.getElementById("nome").value;
        payload.cpf = document.getElementById("cpf").value;
        payload.telefone = document.getElementById("telefonePessoa").value;
    }

    const { error: dbError } = await supabase
        .from("usuarios")
        .insert(payload);

    if (dbError) {
        alert(dbError.message);
        return;
    }

    alert("Cadastro realizado! Faça login.");
    window.location.href = "login.html";
}

// ===============================
// TROCAR TIPO DE CADASTRO
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

// ===============================
// PROTEGER SERVICOS.HTML
// ===============================
async function protegerServicos() {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
        window.location.replace("login.html");
    }
}

// ===============================
// MOSTRAR USUÁRIO LOGADO
// ===============================
async function mostrarUsuario() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;

    const { data: usuario } = await supabase
        .from("usuarios")
        .select("nome, empresa, tipo")
        .eq("id", data.user.id)
        .single();

    if (!usuario) return;

    const nome =
        usuario.tipo === "empresa"
            ? usuario.empresa
            : usuario.nome;

    const span = document.getElementById("nomeUsuario");
    if (span) span.textContent = nome;
}

// ===============================
// AUTOEXECUÇÃO POR PÁGINA
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    if (location.pathname.includes("servicos.html")) {
        protegerServicos();
        mostrarUsuario();
    }
});