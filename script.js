// ===============================
// SUPABASE INIT (ÚNICA VEZ)
// ===============================
const SUPABASE_URL = "https://bfynkxmdsydbmkdttdok.supabase.co";
const SUPABASE_KEY = "SUA_ANON_KEY_AQUI"; // mantém a sua

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ===============================
// PROTEÇÃO REAL DE PÁGINA
// ===============================
async function protegerPagina() {
    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (!session) {
        window.location.replace("login.html");
    }
}

// ===============================
// INIT GLOBAL
// ===============================
document.addEventListener("DOMContentLoaded", async () => {

    // protege apenas páginas privadas
    if (location.pathname.includes("servicos.html")) {
        await protegerPagina();
    }

    // header (index ou serviços)
    await carregarUsuarioHeader();

    // botão logout
    const btn = document.getElementById("btnLogout");
    if (btn) btn.onclick = logout;
});

// ===============================
// REGISTRO
// ===============================
async function registrar() {
    const tipo = tipoEl().value;
    const email = emailEl().value;
    const senha = senhaEl().value;

    if (!tipo || !email || !senha) {
        alert("Preencha todos os campos");
        return;
    }

    const { error } = await supabase.auth.signUp({
        email,
        password: senha
    });

    if (error) {
        alert(error.message);
        return;
    }

    // login automático
    await supabase.auth.signInWithPassword({ email, password: senha });

    const { data: { user } } = await supabase.auth.getUser();

    let payload = {
        id: user.id,
        tipo,
        email
    };

    if (tipo === "empresa") {
        payload.empresa = empresaEl().value;
        payload.cnpj = cnpjEl().value;
        payload.telefone = telEmpresaEl().value;
    } else {
        payload.nome = nomeEl().value;
        payload.cpf = cpfEl().value;
        payload.telefone = telPessoaEl().value;
    }

    const { error: dbError } = await supabase.from("usuarios").insert(payload);

    if (dbError) {
        alert(dbError.message);
        return;
    }

    window.location.href = "servicos.html";
}

// ===============================
// LOGIN
// ===============================
async function login() {
    const email = emailEl().value;
    const senha = senhaEl().value;

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
// LOGOUT
// ===============================
async function logout() {
    await supabase.auth.signOut();
    window.location.replace("login.html");
}

// ===============================
// HEADER USER
// ===============================
async function carregarUsuarioHeader() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: usuario } = await supabase
        .from("usuarios")
        .select("nome, empresa, tipo")
        .eq("id", user.id)
        .single();

    if (!usuario) return;

    const nome =
        usuario.tipo === "empresa"
            ? usuario.empresa
            : usuario.nome;

    const span = document.getElementById("nomeUsuario");
    const box = document.getElementById("userBox");

    if (span) span.textContent = nome;
    if (box) box.style.display = "block";
}

// ===============================
// TROCAR TIPO
// ===============================
function trocarTipo() {
    empresaCampos().style.display = "none";
    pessoaCampos().style.display = "none";

    if (tipoEl().value === "empresa") empresaCampos().style.display = "block";
    if (tipoEl().value === "pessoa") pessoaCampos().style.display = "block";
}

// ===============================
// WHATSAPP
// ===============================
async function contatoWhats(nomeFreela, bairro, servico) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: u } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", user.id)
        .single();

    const dados = u.tipo === "empresa"
        ? `Empresa: ${u.empresa}\nCNPJ: ${u.cnpj}`
        : `Nome: ${u.nome}\nCPF: ${u.cpf}`;

    const msg = `
Solicitação via TaskUp

Serviço: ${servico}
Profissional: ${nomeFreela}
Bairro: ${bairro}

${dados}
Email: ${u.email}
Telefone: ${u.telefone}
    `;

    window.open(`https://wa.me/5531992111470?text=${encodeURIComponent(msg)}`);
}

// ===============================
// HELPERS DOM
// ===============================
const tipoEl = () => document.getElementById("tipo");
const emailEl = () => document.getElementById("email");
const senhaEl = () => document.getElementById("senha");
const empresaEl = () => document.getElementById("empresa");
const cnpjEl = () => document.getElementById("cnpj");
const telEmpresaEl = () => document.getElementById("telefoneEmpresa");
const nomeEl = () => document.getElementById("nome");
const cpfEl = () => document.getElementById("cpf");
const telPessoaEl = () => document.getElementById("telefonePessoa");
const empresaCampos = () => document.getElementById("empresaCampos");
const pessoaCampos = () => document.getElementById("pessoaCampos");