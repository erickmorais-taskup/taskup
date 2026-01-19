// ===== SUPABASE CONFIG =====
const supabaseUrl = "https://SEU-PROJETO.supabase.co";
const supabaseKey = "SUA_ANON_KEY";
const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

// ===== REGISTRO =====
async function registrar() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const tipo = document.getElementById("tipo").value;

  let metadata = {};

  if (tipo === "empresa") {
    metadata = {
      tipo: "empresa",
      empresa: document.getElementById("empresa").value,
      cnpj: document.getElementById("cnpj").value
    };
  }

  if (tipo === "pessoa") {
    metadata = {
      tipo: "pessoa",
      nome: document.getElementById("nome").value,
      cpf: document.getElementById("cpf").value
    };
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

// ===== LOGIN =====
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

// ===== LOGOUT =====
async function logout() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}

// ===== PROTEÇÃO DE PÁGINA =====
async function protegerPagina() {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    window.location.replace("login.html");
    return;
  }

  document.body.style.display = "block";

  // Nome no header
  const nome =
    data.user.user_metadata?.empresa ||
    data.user.user_metadata?.nome ||
    "Usuário";

  const span = document.getElementById("nomeUsuario");
  if (span) span.textContent = nome;
}