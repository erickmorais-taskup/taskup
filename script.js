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

// DADOS MEU PERFIL
// DADOS MEU PERFIL
async function carregarPerfil() {
  const { data: { user } } = await sb.auth.getUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const { data: usuario, error } = await sb
    .from("usuarios")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !usuario) {
    alert("Erro ao carregar perfil");
    console.error(error);
    return;
  }

  // Dados básicos
  document.getElementById("perfilNome").textContent =
    usuario.nome || usuario.empresa || "";

  document.getElementById("perfilEmail").textContent = user.email;
  document.getElementById("perfilTipo").textContent = usuario.tipo;

  // Telefone
  if (document.getElementById("perfilTelefone")) {
    document.getElementById("perfilTelefone").textContent =
      usuario.telefone || "Não informado";
  }

  // Pessoa
  if (usuario.tipo === "pessoa") {
    document.getElementById("perfilCpfBox").style.display = "block";
    document.getElementById("perfilCpf").textContent =
      usuario.cpf || "Não informado";
  }

  // Empresa
  if (usuario.tipo === "empresa") {
    document.getElementById("perfilEmpresaBox").style.display = "block";
    document.getElementById("perfilEmpresa").textContent =
      usuario.empresa || "";

    document.getElementById("perfilCnpjBox").style.display = "block";
    document.getElementById("perfilCnpj").textContent =
      usuario.cnpj || "Não informado";
  }
}