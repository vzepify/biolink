
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

loginTab.onclick = () => {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
};

registerTab.onclick = () => {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
};

function register(){
  const user = document.getElementById("registerUser").value;
  const pass = document.getElementById("registerPass").value;

  let users = JSON.parse(localStorage.getItem("users") || "{}");

  if(users[user]){
    alert("Username exists");
    return;
  }

  users[user] = {
    password: pass,
    profile: {
      name: user,
      bio: "My custom profile",
      avatar: "https://placehold.co/120x120",
      links: [],
      appearance:{
        accent:"#7c5cff",
        background:"#111111"
      }
    }
  };

  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created");
}

function login(){
  const user = document.getElementById("loginUser").value;
  const pass = document.getElementById("loginPass").value;

  let users = JSON.parse(localStorage.getItem("users") || "{}");

  if(users[user] && users[user].password === pass){
    localStorage.setItem("currentUser", user);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid login");
  }
}
