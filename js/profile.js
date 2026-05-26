
const params = new URLSearchParams(window.location.search);
const user = params.get("user");

let users = JSON.parse(localStorage.getItem("users") || "{}");

if(users[user]){
  const profile = users[user].profile;

  document.getElementById("profileAvatar").src = profile.avatar;
  document.getElementById("profileName").innerText = profile.name;
  document.getElementById("profileBio").innerText = profile.bio;

  document.body.style.background = profile.appearance.background;

  const linksContainer = document.getElementById("profileLinks");

  profile.links.forEach(link=>{
    const a = document.createElement("a");
    a.href = link.url;
    a.innerText = link.title;
    a.className = "profile-link";
    a.target = "_blank";

    a.style.border = `2px solid ${profile.appearance.accent}`;

    linksContainer.appendChild(a);
  });
}
