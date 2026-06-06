let online = navigator.onLine;let started = false;
let storepath = "https://api.github.com/repos/raredeveloperofficials/raredeveloperwebsitedatastorage/contents/store";
let storepathraw = "https://raw.githubusercontent.com/raredeveloperofficials/raredeveloperwebsitedatastorage/main/store";

networkCoditionChanged();
window.addEventListener("online",()=>{
  online = true;
  networkCoditionChanged();
});
window.addEventListener("offline",()=>{
  online = false;
  networkCoditionChanged();
});

function networkCoditionChanged(){
  if(!online){
    alert("We're Offline,Check your network Connection.");
  }
  if(online && !started){
    startUp();
  }
}
async function getStoreFolders() {
    const response = await fetch(
        storepath
    );

    const data = await response.json();

    const folders = data
        .filter(item => item.type === "dir")
        .map(item => item.name);

    return folders;
}
function parseDescription(text){
    const result = {};

    const lines = text.split("\n");

    for(const line of lines){
        const [key, value] = line.split(":");

        if(key && value){
            result[key.trim()] = value.trim();
        }
    }

    if(result.download){
        result.download = result.download
            .split(",")
            .map(s => s.trim());
    }

    return result;
}
async function createListElement(name){
  let desc = await readFile(storepathraw+"/"+name+"/description");
  let json = parseDescription(desc);
  let elm = document.createElement("div");
  let nme = document.createElement("h1");
  let img = document.createElement("img");

  
  nme.textContent = name;
  console.log(json);
  nme.className = "grad";
  
  img.src = storepathraw+"/"+name+"/"+json["icon"];
  img.width = 100;
  img.height = 100;
  img.style.objectFit = "contain";
  
  elm.append(nme);
  elm.append(img);
 {
    let container = document.createElement("div");
    let nm = document.createElement("h4");
    let dbtn = document.createElement("button");
    container.style.display = "flex";
    container.style.marginBottom = "5px";
    dbtn.textContent = " Show ";
    dbtn.addEventListener("click",()=>{
      alert(json["desc"].replaceAll("\\n","\n"));
    });
    nm.textContent = "Description:";
    nm.className = "grad";
    container.append(nm);
    container.append(dbtn);
    elm.append(container);
  }
  for(const down of json["download"]){
    const dw = storepathraw+"/"+name+"/"+down; 
    let container = document.createElement("div");
    let nm = document.createElement("h4");
    let dbtn = document.createElement("button");
    container.style.display = "flex";
    container.style.marginBottom = "5px";
    dbtn.textContent = "Download";
    dbtn.addEventListener("click",()=>{
      window.open(dw, "_blank");
    });
    nm.textContent = down+":";
    nm.className = "grad";
    container.append(nm);
    container.append(dbtn);
    elm.append(container);
  }
  elm.style.border = "2px solid #bb86fc";
  elm.style.paddingLeft="5px";
  elm.style.borderRadius = "20px";
  
  return elm;
}
async function readFile(from) {
    const response = await fetch(
       from
    );

    const text = await response.text();

    return text;
}
document.addEventListener("DOMContentLoaded",startUp);

async function startUp(){
  let list = document.getElementById("list");
  if(!started&&list!=null){
    started = true;
    const folders = await getStoreFolders();
    for(const s of folders){
      const elem = await createListElement(s);
      list.append(elem);
      
    }
  }
}


