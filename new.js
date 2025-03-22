let peopleList = [];
let groupList = [];
// TODO change groupList to be an array of arrays
// [ [u1, u3], [u2, u4, u5] ]

function checkPeople(event) {
  const peopleInput = document.getElementById("peopleInput").value;

  peopleList = peopleList.filter(p => p.group !== "holder");
  const knownNames = peopleList.map(p => p.name);
  for (const name of peopleInput.split(",").filter(p => p !== "")) {
    if (knownNames.indexOf(name) >= 0) {
      continue;
    }
    peopleList.push({
      id: `p-${name}`,
      name: name,
      group: "holder",
      locked: false,
    });
  }

  render();
}

function render() {
  const groupsDiv = document.getElementById("groups");
  groupsDiv.innerHTML = "";
  for (const g of groupList) {
    const groupDiv = document.createElement("div");
    groupDiv.id = g;
    const p = document.createElement("p");
    p.innerHTML = g;
    groupDiv.appendChild(p);
    groupDiv.classList.add("group");
    if (g === "holder") {
      groupDiv.classList.add("holder");
      const peopleHolder = document.createElement("div");
      peopleHolder.id = "peopleHolder";
      peopleHolder.style = "display: inline-block";
      groupDiv.appendChild(peopleHolder);
    } else {
      groupDiv.classList.add("active");
    }
    groupDiv.ondragover = onDragOverHandler;
    groupDiv.ondrop = onDropHandler;
    groupsDiv.appendChild(groupDiv);
  }

  const holderDiv = document.getElementById("peopleHolder");
  holderDiv.innerHTML = "";
  for (const p of peopleList) {
    const personDiv = document.createElement("div");
    personDiv.id = p.id;
    personDiv.classList.add("person");
    personDiv.innerHTML = p.name;
    personDiv.draggable = !p.locked;
    personDiv.ondragstart = onDragStartHandler;
    personDiv.onclick = onPersonClick;
    if (p.locked) {
      personDiv.classList.add("locked");
    }
    switch (p.group) {
    case "holder":
      holderDiv.appendChild(personDiv);
    default:
      const g = document.getElementById(p.group);
      if (!g) {
        holderDiv.appendChild(personDiv);
        p.group = "holder";
      } else {
        g.appendChild(personDiv);
      }
    }
  }
}

function onPersonClick(e) {
  peopleList.filter(p => p.id === e.target.id)[0].locked =
    !peopleList.filter(p => p.id === e.target.id)[0].locked;

  render();
}

function checkGroups() {
  const groupsInput = document.getElementById("groupsInput").value;
  groupList = [ "holder" ];
  for (const g of groupsInput.split(",").filter(g => g !== "")) {
    if (groupList.indexOf(g) === -1) {
      groupList.push(g);
    }
  }
  render();
}

function onDropHandler(e) {
  const personId = e.dataTransfer.getData("application/drag-element");
  let groupId = groupList.indexOf(e.target.id) >= 0 ?
      e.target.id : e.target.parentNode.id;
  peopleList.filter(p => p.id === personId)[0].group = groupId;
  render();
}

function onDragOverHandler(e) {
  e.preventDefault();
}

function onDragStartHandler(e) {
  e.dataTransfer.setData("application/drag-element", e.target.id);
}

function randomize() {
  const validGroups = groupList.filter(g => g !== "holder");
  const maxGroups = validGroups.length;
  let groupIndex = 0;
  for (const p of peopleList.filter(p => !p.locked)) {
    p.group = validGroups[groupIndex++];
    if (groupIndex === maxGroups)
      groupIndex = 0;
  }

  render();
}

function populateInputsMockData() {
  const groupsInput = document.getElementById("groupsInput");
  const peopleInput = document.getElementById("peopleInput");
  groupsInput.value = "group1,group2";
  peopleInput.value = "user1,user2,user3";
}

populateInputsMockData();
checkGroups();
checkPeople();
