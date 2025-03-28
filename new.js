let groupList = [];
// TODO change groupList to be an array of arrays
// [ [u1, u3], [u2, u4, u5] ]

function checkNameAlreadyExists(name) {
  for (const group of groupList) {
    if (group.people.filter(p => p.name === name).length > 0)
      return true;
  }
  return false;
}

function checkPeople(event) {
  const peopleInput = document.getElementById("peopleInput").value;
  const holderGroup = groupList.filter(g => g.name === "holder")[0];
  holderGroup.people = [];
  const peopleNames = peopleInput.split(",").filter(p => p !== "");

  for (const name of peopleNames) {
    if (!checkNameAlreadyExists(name)) {
      const personId = `p-${name}`;
      holderGroup.people.push({
        id: personId,
        name: name,
        locked: false,
      });
    }
  }

  for (const g of groupList) {
    for (let i=0; i<g.people.length; i++) {
      if(peopleNames.indexOf(g.people[i].name) === -1) {
        g.people.splice(i, 1);
      }
    }
  }

  render();
}

function render() {
  const groupsDiv = document.getElementById("groups");
  groupsDiv.innerHTML = "";
  for (const g of groupList) {
    const groupDiv = document.createElement("div");
    groupDiv.id = g.name;
    const p = document.createElement("p");
    p.innerHTML = g.name;
    groupDiv.appendChild(p);
    groupDiv.classList.add("group");
    if (g.name === "holder") {
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

    for (const person of g.people) {
      const personDiv = document.createElement("div");
      personDiv.id = person.id;
      personDiv.classList.add("person");
      personDiv.innerHTML = person.name;
      personDiv.draggable = !person.locked;
      personDiv.ondragstart = onDragStartHandler;
      personDiv.onclick = onPersonClick;
      if (person.locked) {
        personDiv.classList.add("locked");
      }
      groupDiv.appendChild(personDiv);
    }

    groupsDiv.appendChild(groupDiv);
  }
}

function onPersonClick(e) {
  groupList.map(g => {
    const person = g.people.filter(p => p.id === e.target.id);
    if (person && person.length > 0) {
      person[0].locked = !person[0].locked;
      return;
    }
  });

  render();
}

function checkGroups() {
  // TODO this is not what I want
  const groupsInput = `holder,${document.getElementById("groupsInput").value}`;
  const parsedGroups = groupsInput
        .split(",")
        .filter(g => g !== "") // don't want empty group names
        .filter(g => groupList.indexOf(g) === -1); // shouldn't already exists

  const currentGroups = groupList;
  groupList = [];
  for (const group of parsedGroups) {
    // when updating groups, the old groups should have the same people in it
    const filterExisting = currentGroups.filter(g => g.name === group && g.people.length > 0);
    if (filterExisting.length > 0) {
      groupList.push({ name: group, people: filterExisting[0].people });
    } else {
      groupList.push({ name: group, people: [] });
    }
  }

  // After setting up the groups, any group that's in the list but not
  // in the input should be deleted, and the people that was assigned
  // to that group should move to the holder group.
  const holderGroup = groupList.filter(g => g.name === "holder")[0];
  for (const group of currentGroups) {
    if (groupList.filter(g => g.name === group.name).length === 0) {
      holderGroup.people.push(...group.people);
    }
  }

  render();
}

function onDropHandler(e) {
  const personGroupId = e.dataTransfer.getData("application/drag-element").split("#");
  const groupId = groupList.filter(g => g.name === e.target.id).length > 0 ?
        e.target.id : e.target.parentNode.id; // TODO make sure the parent is a group
  const newGroup = groupList.filter(g => g.name === groupId)[0];
  const personId = personGroupId[0];
  const oldGroupName = personGroupId[1];
  const oldGroup = groupList.filter(g => g.name === oldGroupName)[0];

  const index = oldGroup.people
        .map(p => p.id === personId)
        .indexOf(true);

  const person = oldGroup.people.splice(index, 1);
  newGroup.people.push(person[0]);

  render();
}

function onDragOverHandler(e) {
  e.preventDefault();
}

function onDragStartHandler(e) {
  e.dataTransfer.setData("application/drag-element", `${e.target.id}#${e.target.parentNode.id}`);
}

function shuffle(arr) {
  let currentIndex = arr.length - 1;
  let randomIndex = Math.floor(Math.random() * arr.length);
  while(currentIndex >= 0) {
    [arr[randomIndex],arr[currentIndex]] =
      [arr[currentIndex],arr[randomIndex]];
    randomIndex = Math.floor(Math.random() * arr.length);
    currentIndex--;
  }
}

function listOfAllPeople(includeLocked) {
  let peopleList = [];
  groupList.map(g => {
    if (includeLocked) {
      peopleList.push(...g.people.filter(p => !p.locked));
    } else {
      peopleList.push(...g.people);
    }
  });
  return peopleList;
}

function randomize() {
  const validGroups = groupList.filter(g => g.name !== "holder");
  const notLockedPeople = [];
  groupList.map(g => {
    const lps = g.people.filter(p => p.locked);
    const ps = g.people.filter(p => !p.locked);
    g.people = lps;
    notLockedPeople.push(...ps);
  });
  shuffle(notLockedPeople);
  let groupIndex = 0;
  for (const p of notLockedPeople) {
    validGroups[groupIndex++].people.push(p);
    if (groupIndex === validGroups.length)
      groupIndex = 0;
  }

  render();
}

function populateInputsMockData() {
  const groupsInput = document.getElementById("groupsInput");
  const peopleInput = document.getElementById("peopleInput");
  groupsInput.value = "group1,group2";
  peopleInput.value = "user1,user2,user3,user4,user5,user6";
}

populateInputsMockData();
checkGroups();
checkPeople();
