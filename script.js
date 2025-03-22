let peopleList = [];
const peopleHolderName = "holder";
let groupList = [];

function checkPeople(e) {
  const peopleInput = document.getElementById("peopleInput").value;
  const peopleHolder = document.getElementById(peopleHolderName);
  peopleHolder.innerHTML = "";
  peopleStatus = {};
  for (const person of peopleInput.split(",").filter(s => s != "")) {
    peopleList.push({
      name: person,
      group: peopleHolderName,
    });
    peopleStatus[person] = {
      element: personDiv,
      group: peopleHolderName,
    };
  }
  renderStatus();
}

function lockPersonToGroup(e) {
  if (peopleStatus[e.target.id].group === peopleHolderName) {
    return;
  }

  const personDiv = document.getElementById(e.target.id);
  if (personDiv.classList.contains("locked")) {
    // TODO unlock
    personDiv.classList.remove("locked");
    personDiv.draggable = true;
  } else {
    personDiv.classList.add("locked");
    personDiv.draggable = false;
  }
}

function checkGroups(e) {
  const groupsInput = document.getElementById("groupsInput").value;
  const groupsDiv = document.getElementById("groups");
  groupsDiv.innerHTML = "";
  groupList = [];
  for (const group of groupsInput.split(",").filter(s => s != "")) {
    const groupDiv = document.createElement("div");
    groupDiv.id = group;
    groupDiv.classList.add("group");
    groupDiv.classList.add("active");
    groupDiv.setAttribute("ondragover", dragstartHandler);
    groupDiv.setAttribute("ondrop", dropHandler);
    groupDiv.innerHTML = `${group}: `;
    groupsDiv.appendChild(groupDiv);

    groupList.push(groupDiv);
  }
}

function dragstartHandler(e) {
  console.log("drag start:", e.target.id);
  e.dataTransfer.setData("application/drag-element", e.target.id);
}

function dropHandler(e) {
  e.preventDefault();
  const element = e.dataTransfer.getData("application/drag-element");
  if (e.target.classList.contains("group")) { // avoid merging people
    e.target.appendChild(document.getElementById(element));
  }
  if (e.target.parentNode.classList.contains("group")) {
    e.target.parentNode.appendChild(document.getElementById(element));
  }
  console.log("dropped:", e.target.id);

  if (e.target.id === peopleStatus[element].group) {
    return;
  }

  peopleStatus[element].group = e.target.id;
  renderStatus(element);
}

function dragoverHandler(e) {
  // TODO not sure I need this, can add a style to make the hover group bigger
  e.preventDefault();
}

function renderStatus(elementToHighlight) {
  const statusDiv = document.getElementById("status");
  statusDiv.innerHTML = "";
  const highlightStyle = "style='animation: highlight 1s'";
  let customStyle = "";
  for (const p in peopleList) {
    const personDiv = document.createElement("div");
    personDiv.id = person; // TODO change ID as two people can be called the same?
    personDiv.classList.add("person");
    personDiv.classList.add("person-disabled");
    personDiv.innerHTML = person;
    personDiv.draggable = true;
    personDiv.ondragstart = dragstartHandler;
    personDiv.onclick = lockPersonToGroup;
    peopleHolder.appendChild(personDiv);
    // if (elementToHighlight === p) {
    //   customStyle += highlightStyle;
    // }
    // statusDiv.innerHTML += `${p}: <span ${customStyle}>${peopleStatus[p].group}</span>, `;
    // customStyle = "";
  }
}

function randomize() {
  let currentGroupIndex = 0;
  for (const p in peopleStatus) {
    groupList[currentGroupIndex].appendChild(peopleStatus[p].element);
    peopleStatus[p].group = groupList[currentGroupIndex].id;
    currentGroupIndex++;
    if (currentGroupIndex >= groupList.length) {
      currentGroupIndex = 0;
    }
  }
}

checkPeople(undefined);
checkGroups(undefined);
renderStatus();
