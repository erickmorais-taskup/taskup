// ===============================
// SUPABASE CLIENT (NOME DIFERENTE)
// ===============================
const SUPABASE_URL = "https://bfynkxmdsydbmkdttdok.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmeW5reG1kc3lkYm1rZHR0ZG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MTQ3NzEsImV4cCI6MjA4NDI5MDc3MX0.Dvbijztg4bHPcxgjVhpfGcAfwNJrbv2CsuGktG9nqyg";

const sb = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("Supabase inicializado:", sb);

// ===============================
// LOGIN
// ===============================
async function login() {
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

  window.location.href = "index.html";
}

// ===============================
// REGISTRO
// ===============================
async function registrar() {
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

  const { error: dbError } = await sb
    .from("usuarios")
    .insert(payload);

  if (dbError) {
    alert(dbError.message);
    return;
  }

  window.location.href = "login.html";
}

// ===============================
// TROCAR TIPO
// ===============================
function trocarTipo() {
  document.getElementById("empresaCampos").style.display = "none";
  document.getElementById("pessoaCampos").style.display = "none";

  const tipo = document.getElementById("tipo").value;

  if (tipo === "empresa") {
    document.getElementById("empresaCampos").style.display = "block";
  } else if (tipo === "pessoa") {
    document.getElementById("pessoaCampos").style.display = "block";
  }
}

// ===============================
// BLOQUEIO DE SERVIÇOS
// ===============================
async function irParaServicos() {
  const { data: { user } } = await sb.auth.getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  window.location.href = "servicos.html";
}

// ===============================
// LOGOUT
// ===============================
async function logout() {
  await sb.auth.signOut();
  window.location.href = "index.html";
}

// DADOS MEU PERFIL// Função para colocar a primeira letra maiúscula
function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Funções para formatar CPF e CNPJ
function formatCPF(cpf) {
    if (!cpf) return "";
    return cpf.replace(/\D/g, '')
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatCNPJ(cnpj) {
    if (!cnpj) return "";
    return cnpj.replace(/\D/g, '')
               .replace(/(\d{2})(\d)/, "$1.$2")
               .replace(/(\d{3})(\d)/, "$1.$2")
               .replace(/(\d{3})(\d)/, "$1/$2")
               .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

// Carregar dados do perfil
async function carregarPerfil() {
    if (!sb) return;

    // Pega o usuário logado
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Busca os dados do usuário na tabela
    const { data: usuario, error } = await sb
        .from("usuarios")
        .select("id, nome, empresa, cpf, cnpj, telefone, email, tipo")
        .eq("id", user.id)
        .maybeSingle();

    if (error || !usuario) {
        alert("Erro ao carregar perfil");
        return;
    }

    // Nome ou empresa
    const nomeEl = document.getElementById("perfilNome");
    if (nomeEl) nomeEl.textContent = usuario.nome || usuario.empresa || "Sem nome";

    // Email
    const emailEl = document.getElementById("perfilEmail");
    if (emailEl) emailEl.textContent = user.email || "Não informado";

    // Tipo de conta com primeira letra maiúscula
    // Converte tipo para nome amigável
    let tipoExibicao = "";
    if (usuario.tipo === "pessoa") {
        tipoExibicao = "Pessoa Física";
    } else if (usuario.tipo === "empresa") {
        tipoExibicao = "Empresa";
    }

const tipoEl = document.getElementById("perfilTipo");
tipoEl.textContent = tipoExibicao;

// opcional: adiciona uma "badge" colorida
tipoEl.classList.remove("badge-pessoa", "badge-empresa");
if (usuario.tipo === "pessoa") tipoEl.classList.add("badge-pessoa");
if (usuario.tipo === "empresa") tipoEl.classList.add("badge-empresa");

    // Telefone
    const telefoneEl = document.getElementById("perfilTelefone");
    if (telefoneEl) telefoneEl.textContent = usuario.telefone || "Não informado";

    // CPF (para pessoa)
    const cpfBox = document.getElementById("perfilCPFBox");
    const cpfEl = document.getElementById("perfilCPF");
    if (usuario.tipo === "pessoa" && cpfEl && cpfBox) {
        cpfBox.style.display = "block";
        cpfEl.textContent = formatCPF(usuario.cpf);
    } else if (cpfBox) {
        cpfBox.style.display = "none";
    }

    // CNPJ (para empresa)
    const cnpjBox = document.getElementById("perfilCNPJBox");
    const cnpjEl = document.getElementById("perfilCNPJ");
    if (usuario.tipo === "empresa" && cnpjEl && cnpjBox) {
        cnpjBox.style.display = "block";
        cnpjEl.textContent = formatCNPJ(usuario.cnpj);
    } else if (cnpjBox) {
        cnpjBox.style.display = "none";
    }