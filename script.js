// JavaScript code for player team randomizer
let players = [];

// Function to select the randomization method
function getSelectedRandomizationMethod() {
  const radioButtons = document.getElementsByName("randomization");
  let selectedMethod = "shuffle"; // Default method
  radioButtons.forEach((button) => {
    if (button.checked) {
      selectedMethod = button.value;
    }
  });
  return selectedMethod;
}

// Function to sort players by rank, with NaN rank players placed at the bottom
function sortPlayersByRank(players) {
  return players.sort((a, b) => {
    if (isNaN(a.rank) && isNaN(b.rank)) {
      // If both ranks are NaN, maintain the original order
      return 0;
    } else if (isNaN(a.rank)) {
      // If a has NaN rank, place it after b
      return 1;
    } else if (isNaN(b.rank)) {
      // If b has NaN rank, place it before a
      return -1;
    } else {
      // Otherwise, sort by rank normally
      return a.rank - b.rank;
    }
  });
}

// Function to add a player
function addPlayer() {
  const playerNameInput = document.getElementById("playerName");
  const playerRankInput = document.getElementById("playerRank");

  const playerName = playerNameInput.value.trim();
  const playerRank = parseInt(playerRankInput.value);

  // Check for duplicate player names
  const isDuplicate =
    players.some(
      (player) => player.name.toLowerCase() === playerName.toLowerCase()
    ) || players.some((player) => player.rank === playerRank);

  if (playerName) {
    if (isDuplicate) {
      alert("Player name or rank already exists. Double check.");
    } else {
      playerRank === 0
        ? players.push({ name: playerName, rank: 1000 })
        : players.push({ name: playerName, rank: playerRank });
      playerNameInput.value = "";
      playerRankInput.value = "";
      playerNameInput.focus();
      sortPlayersByRank(players);
      // Display the updated list of players
      displayPlayers();
      updatePlayerCount();
    }
  } else {
    alert("Please enter a valid player name and rank.");
  }
}

// Function to display the list of players
// Function to display the list of players
function displayPlayers() {
  const currentPlayersList = document.getElementById("currentPlayers");
  currentPlayersList.innerHTML = ""; // Clear previous list

  players.forEach((player, index) => {
    const playerItem = document.createElement("li");

    // Create span for player name and rank
    const playerSpan = document.createElement("span");
    playerSpan.textContent = `${player.name} (${player.rank})`;

    // Add delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deletePlayer(index));

    // Style player span and delete button to be displayed inline
    deleteButton.style.display = "inline";
    deleteButton.style.marginTop = "0px";
    playerSpan.style.display = "inline";
    playerSpan.style.marginRight = "8px";

    // Append player span and delete button to player item
    playerItem.appendChild(playerSpan);
    playerItem.appendChild(deleteButton);

    playerItem.style.marginTop = "0 px";

    // Append player item to current players list
    currentPlayersList.appendChild(playerItem);
  });
}

// Function to delete a player
function deletePlayer(index) {
  players.splice(index, 1);
  // Display the updated list of players
  displayPlayers();
  // Update player count
  updatePlayerCount();
}

// Function to update player count
function updatePlayerCount() {
  const playerCountElement = document.getElementById("playerCount");
  playerCountElement.textContent = `(${players.length})`;
}

// Function to shuffle an array randomly
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to split players into high rank and low rank groups
function splitPlayers(players) {
  const sortedPlayers = sortPlayersByRank(players);
  const halfwayIndex = Math.ceil(sortedPlayers.length / 2);
  const highRank = sortedPlayers.slice(0, halfwayIndex);
  const lowRank = sortedPlayers.slice(halfwayIndex);
  return { highRank, lowRank };
}

function inverseSplitPlayers(players) {
  const sortedPlayers = sortPlayersByRank(players);
  const halfwayIndex = Math.ceil(sortedPlayers.length / 2);
  const highRank = sortedPlayers.slice(0, halfwayIndex);
  let lowRank = sortedPlayers.slice(halfwayIndex);
  lowRank = lowRank.reverse();
  return { highRank, lowRank };
}

// Function to pair players from high rank and low rank groups
function pairPlayers(highRank, lowRank) {
  const pairs = [];
  const numPairs = Math.min(highRank.length, lowRank.length);
  for (let i = 0; i < numPairs; i++) {
    pairs.push([highRank[i], lowRank[i]]);
  }
  return pairs;
}

// Function to add a placeholder player if there is an odd number of players
function addPlaceholderPlayer(players) {
  if (players.length % 2 !== 0) {
    players.push({ name: "Placeholder", rank: NaN });
  }
}

// Function to display teams
function displayTeams(teams) {
  const teamsContainer = document.getElementById("teamsContainer");
  teamsContainer.innerHTML = "";
  teams.forEach((team, index) => {
    const teamDiv = document.createElement("div");
    teamDiv.classList.add("team");
    teamDiv.innerHTML = "";
    team.forEach((player) => {
      teamDiv.innerHTML += `<div>${player.name} (${player.rank})</div>`;
    });
    teamsContainer.appendChild(teamDiv);
  });
}

// Function to sort teams by rank of the first player
function sortTeamsByRank(teams) {
  teams.sort((a, b) => a[0].rank - b[0].rank);
}

// Event listener for adding a player
document.getElementById("addPlayerButton").addEventListener("click", addPlayer);

document.getElementById("randomizeButton").addEventListener("click", () => {
  // Get selected randomization method
  const randomizationMethod = getSelectedRandomizationMethod();

  // Add a placeholder player if the number of players is odd
  addPlaceholderPlayer(players);

  let pairedPlayers;
  if (randomizationMethod === "split") {
    // Split players into high rank and low rank groups
    const { highRank, lowRank } = splitPlayers(players);
    // Pair players from high rank and low rank groups randomly
    pairedPlayers = pairPlayers(highRank, shuffle(lowRank));
  } else if (randomizationMethod === "inverse") {
    // Split players into high rank and low rank groups then reverse the low ranked group
    const { highRank, lowRank } = inverseSplitPlayers(players);
    // Pair players from high rank and low rank groups by sorting
    pairedPlayers = pairPlayers(highRank, lowRank);
  } else if (randomizationMethod === "true") {
    // Shuffle the entire list of players
    const shuffledPlayers = shuffle(players);
    // Split the shuffled list into two halves
    const halfwayIndex = Math.ceil(shuffledPlayers.length / 2);
    const firstHalf = shuffledPlayers.slice(0, halfwayIndex);
    const secondHalf = shuffledPlayers.slice(halfwayIndex);
    // Pair players from the first half with players from the second half
    pairedPlayers = pairPlayers(firstHalf, secondHalf);
  }
  // Display paired players
  displayTeams(pairedPlayers);
  // Show download button
  document.getElementById("downloadTeamsButton").style.display = "inline-block";
});

// Function to update the text of the randomize button based on the selected randomization method
function updateRandomizeButtonText() {
  const randomizationMethod = getSelectedRandomizationMethod();
  const randomizeButton = document.getElementById("randomizeButton");
  if (randomizationMethod === "inverse") {
    randomizeButton.textContent = "Determine Teams";
  } else {
    randomizeButton.textContent = "Randomize Teams";
  }
}

// Event listener for radio buttons change
document
  .querySelectorAll('input[type="radio"][name="randomization"]')
  .forEach((radio) => {
    radio.addEventListener("change", updateRandomizeButtonText);
  });

updatePlayerCount();

// Function to generate text content of teams
function generateTeamsText(teamsContainer) {
  let teamsText = "";
  const teams = Array.from(teamsContainer.children); // Convert to array
  teams.forEach((team, index) => {
    const teamPlayers = Array.from(team.children).map(
      (player) => player.textContent.split(" (")[0]
    ); // Extract player names
    const teamText = teamPlayers.join(" and "); // Join player names with ' and ' between them
    if (index !== 0) {
      teamsText += "\n"; // Add newline if not the first team
    }
    teamsText += teamText;
  });
  return teamsText;
}

// Function to download teams as a .txt file
function downloadTeamsTxt(teamsContainer) {
  const teamsText = generateTeamsText(teamsContainer);
  const element = document.createElement("a");
  const file = new Blob([teamsText], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = "teams.txt";
  document.body.appendChild(element); // Required for Firefox
  element.click();
  document.body.removeChild(element);
}

// Event listener for downloading teams as .txt file
document.getElementById("downloadTeamsButton").addEventListener("click", () => {
  const teamsContainer = document.getElementById("teamsContainer");
  downloadTeamsTxt(teamsContainer);
});
