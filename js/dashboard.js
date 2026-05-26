
const currentUser = localStorage.getItem("currentUser");
if(!currentUser){
  window.location.href = "index.html";
}

let users = JSON.parse(localStorage.getItem("users") || "{}");
let profile = users[currentUser].profile;

function showSection(id){
  document.querySelectorAll(".section").forEach(sec=>sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function saveProfile(){
  profile.name = document.getElementById("displayName").value;
  profile.bio = document.getElementById("bio").value;
  profile.avatar = document.getElementById("avatar").value;

  saveUsers();
  alert("Profile saved");
}

function addLink(){
  const container = document.getElementById("linksContainer");

  const div = document.createElement("div");
  div.className = "link-item";

  div.innerHTML = `
    <input placeholder="Title">
    <input placeholder="URL">
    <button>Delete</button>
  `;

  div.querySelector("button").onclick = () => {
    div.remove();
    saveLinks();
  };

  container.appendChild(div);
}

function saveLinks(){
  profile.links = [];

  document.querySelectorAll(".link-item").forEach(item=>{
    const inputs = item.querySelectorAll("input");
    profile.links.push({
      title: inputs[0].value,
      url: inputs[1].value
    });
  });

  saveUsers();
}

function saveAppearance(){
  profile.appearance = {
    accent: document.getElementById("accentColor").value,
    background: document.getElementById("bgColor").value,
    style: document.getElementById("cardStyle").value
  };

  saveUsers();
  alert("Appearance updated");
}

function logout(){
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

function saveUsers(){
  users[currentUser].profile = profile;
  localStorage.setItem("users", JSON.stringify(users));
}

function loadData(){
  document.getElementById("displayName").value = profile.name;
  document.getElementById("bio").value = profile.bio;
  document.getElementById("avatar").value = profile.avatar;

  document.getElementById("accentColor").value = profile.appearance.accent;
  document.getElementById("bgColor").value = profile.appearance.background;

  profile.links.forEach(link=>{
    addLink();

    const items = document.querySelectorAll(".link-item");
    const last = items[items.length - 1];

    last.querySelectorAll("input")[0].value = link.title;
    last.querySelectorAll("input")[1].value = link.url;
  });

  document.getElementById("linkCount").innerText = profile.links.length;
}

loadData();

setInterval(saveLinks, 2000);
