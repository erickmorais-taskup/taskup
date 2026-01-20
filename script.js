console.log("script.js carregado");

const SUPABASE_URL = "https://bfynkxmdsydbmkdttdok.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeW5reG1kc3lkYm1rZHR0ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MTQ3NzEsImV4cCI6MjA4NDI5MDc3MX0.Dvbijztg4bHPcxgjVhpfGcAfwNJrbv2CsuGktG9nqyg";

if (!window.supabase) {
    console.error("Supabase SDK NÃO carregou");
} else {
    window.supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );
    console.log("Supabase client criado:", window.supabaseClient);
}

// LOGIN
async function login() {
    if (!sb) return alert("Supabase não inicializado");

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const { error } = await sb.auth.signInWithPassword({
        email,
        password: senha
    });

    if (error) {
        alert(error.message);
        return;
    }

    window.location.href = "servicos.html";
}

// REGISTRO
async function registrar() {
    if (!sb) return alert("Supabase não inicializado");

    const tipo = document.getElementById("tipo").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const { data, error } = await sb.auth.signUp({
        email,
        password: senha
    });

    if (error) {
        alert(error.message);
        return;
    }

    const userId = data.user.id;

    let payload = { id: userId, tipo, email };

    if (tipo === "empresa") {
        payload.empresa = document.getElementById("empresa").value;
        payload.cnpj = document.getElementById("cnpj").value;
        payload.telefone = document.getElementById("telefoneEmpresa").value;
    } else {
        payload.nome = document.getElementById("nome").value;
        payload.cpf = document.getElementById("cpf").value;
        payload.telefone = document.getElementById("telefonePessoa").value;
    }

    const { error: dbError } = await sb.from("usuarios").insert([payload]);

    if (dbError) {
        alert(dbError.message);
        return;
    }

    window.location.href = "login.html";
}

// TROCAR TIPO
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

// BLOQUEADOR
async function irParaServicos() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        window.location.href = "servicos.html";
    } else {
        window.location.href = "login.html";
    }
}