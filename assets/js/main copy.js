let match = {
  selected: false,
  round: [0],
  score: [0],
  players: [
    {
      name: "player1",
      points: [0],
      role: "",
      id: 0,
      ao: "aa",
    },
    {
      name: "player2",
      points: [0],
      role: "",
      id: 1,
      ao: "bb",
    },
    {
      name: "player3",
      points: [0],
      role: "",
      id: 2,
      ao: "cc",
    },
    {
      name: "player4",
      points: [0],
      role: "",
      id: 3,
      ao: "dd",
    },
    {
      name: "player5",
      points: [0],
      role: "",
      id: 4,
      ao: "ee",
    },
  ],
};

const round = document.getElementById("round");
const call = document.getElementById("call");
const main = document.querySelector("main");
const modalName = document.querySelector(".modal_name_hide");
const modalScore = document.querySelector(".modal_score_hide");
const modalWin = document.querySelector(".modal_win_hide");
let data = JSON.parse(localStorage.getItem("local"));
const colPlay = document.getElementsByClassName("player");
const totR = document.getElementById("totR");
const actionCol = document.getElementsByClassName("action");
const scoreBtn = document.getElementById("score_btn");
const check = document.getElementById("check");
const score = document.getElementById("btn_call");

// IN QUESTA SEZIONE LE FUNZIONI IN CASO DI LOCAL STORAGE PRESENTE
if (data) {
  for (const player of data.players) {
    if (player.id == 0) {
      colPlay[player.id].innerHTML += `
          <h6  id="${player.id}" class="name first your_turn">${player.name}</h6>`;
    } else if (player.id == 4) {
      colPlay[player.id].innerHTML += `
          <h6  id="${player.id}" class="name last">${player.name}</h6>`;
    } else {
      colPlay[player.id].innerHTML += `
      <h6  id="${player.id}" class="name">${player.name}</h6>`;
    }
    var firstPlayer = document.querySelector("h6.first");
    var turnPlayer = document.querySelector("h6.your_turn");
    // console.log(turnPlayer);
    for (const point of player.points) {
      colPlay[player.id].innerHTML += `<p>${point}</p>`;
    }
    var total = player.points.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    actionCol[player.id].innerHTML += `
    <h3 class="total">${total}</h3>
    <button id="${player.id}" class="role">Role</button>
    `;
  }
  var roleAction = document.getElementsByClassName("role");
  for (const roleChoose of roleAction) {
    roleChoose.addEventListener("click", function () {
      if (
        !roleChoose.classList.contains("caller") &&
        !roleChoose.classList.contains("called")
      ) {
        roleChoose.classList.add("caller");
        roleChoose.innerHTML = "Caller";
        data.players[roleChoose.id].role = "caller";
        data.selected = true;
      } else if (roleChoose.classList.contains("caller")) {
        roleChoose.classList.remove("caller");
        roleChoose.classList.add("called");
        roleChoose.innerHTML = "Called";
        data.players[roleChoose.id].role = "called";
      } else {
        console.log(roleChoose);
        roleChoose.classList.remove("called");
        roleChoose.innerHTML = "Role";
        data.selected = false;
      }
    });
  }
  for (const roNum of data.round) {
    round.innerHTML += `<p>${roNum}</p>`;
  }
  for (const roCall of data.score) {
    call.innerHTML += `<p>${roCall}</p>`;
  }

  var players = document.getElementsByClassName("name");

  for (const player of players) {
    player.addEventListener("click", function () {
      modalName.classList.remove("modal_name_hide");
      modalName.classList.add("modal_name_show");
      var idName = parseInt(player.id) + 1;
      modalName.innerHTML = `<h2>Player ${idName} Name</h2>
        <form>
            <input type="text" id="input_name" required/>
            <input type="submit" id="name_btn" value="OK"/>
        </form>`;
      const inputName = document.getElementById("input_name");
      var nameBtn = document.getElementById("name_btn");
      nameBtn.addEventListener("click", function () {
        if (inputName.value.length === 0) {
        } else {
          modalName.classList.remove("modal_name_show");
          modalName.classList.add("modal_name_hide");
          data.players[player.id].name = inputName.value;
          localStorage.setItem("local", JSON.stringify(data));
          data = JSON.parse(localStorage.getItem("local"));
          player.innerHTML = `
      <h6  id="${data.players[player.id].id}" class="name">${
            inputName.value
          }</h6>
      `;
        }
      });
    });
  }
  totR.innerHTML = data.round.length - 1;
  score.addEventListener("click", function () {
    modalScore.classList.remove("modal_score_hide");
    modalScore.classList.add("modal_score_show");
    modalScore.innerHTML = `<h2>CALL</h2>
        <form>
            <input type="text" id="input_score" required/>
         <input type="submit" id="choose_btn" value="OK"/>
        </form>`;
    const inputScore = document.getElementById("input_score");
    var chooseBtn = document.getElementById("choose_btn");
    chooseBtn.addEventListener("click", function () {
      if (
        inputScore.value.length === 0 ||
        inputScore.value < 71 ||
        inputScore.value > 119
      ) {
      } else {
        modalScore.classList.remove("modal_score_show");
        modalScore.classList.add("modal_score_hide");
        data.score.push(inputScore.value);
        data.round.push(data.round.length);
        localStorage.setItem("local", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("local"));
        round.innerHTML += `<p>${data.round[data.round.length - 1]}</p>`;
        totR.innerHTML = data.round.length - 1;
      }
    });
  });
  scoreBtn.addEventListener("click", function () {
    modalWin.classList.remove("modal_win_hide");
    modalWin.classList.add("modal_win_show");
    modalWin.innerHTML = `<h2>Who Won?</h2>
    <button id="caller_win">CALLER</button>
    <button id="trio_win">TRIO</button> `;
    var btnWin = document.getElementById("caller_win");
    const btnLose = document.getElementById("trio_win");
    btnWin.addEventListener("click", function () {
      modalWin.classList.remove("modal_win_show");
      modalWin.classList.add("modal_win_hide");
      console.log(data.score[data.score.length - 1]);
      if (
        data.score[data.score.length - 1] > 70 &&
        data.score[data.score.length - 1] < 81 &&
        data.selected == true
      ) {
        for (const player of data.players) {
          if (player.role == "caller") {
            player.points.push(2);
            player.role = "";
          } else if (player.role == "called") {
            player.points.push(1);
            player.role = "";
          } else {
            player.points.push(-1);
          }

          console.log(data);

          colPlay[player.id].innerHTML += `<p>${
            player.points[player.points.length - 1]
          }</p>`;
        }

        data.selected = false;
        localStorage.setItem("local", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("local"));
        location.reload();
      } else if (
        data.score[data.score.length - 1] > 80 &&
        data.score[data.score.length - 1] < 91 &&
        data.selected == true
      ) {
        for (const player of data.players) {
          if (player.role == "caller") {
            player.points.push(4);
            player.role = "";
          } else if (player.role == "called") {
            player.points.push(2);
            player.role = "";
          } else {
            player.points.push(-2);
          }
          colPlay[player.id].innerHTML += `<p>${
            player.points[player.points.length - 1]
          }</p>`;
        }
        data.selected = false;
        localStorage.setItem("local", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("local"));
        location.reload();
      } else if (
        data.score[data.score.length - 1] > 90 &&
        data.score[data.score.length - 1] < 101 &&
        data.selected == true
      ) {
        for (const player of data.players) {
          if (player.role == "caller") {
            player.points.push(6);
            player.role = "";
          } else if (player.role == "called") {
            player.points.push(3);
            player.role = "";
          } else {
            player.points.push(-3);
          }
          colPlay[player.id].innerHTML += `<p>${
            player.points[player.points.length - 1]
          }</p>`;
        }
        data.selected = false;
        localStorage.setItem("local", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("local"));
        location.reload();
      } else if (
        data.score[data.score.length - 1] > 100 &&
        data.score[data.score.length - 1] < 111 &&
        data.selected == true
      ) {
        for (const player of data.players) {
          if (player.role == "caller") {
            player.points.push(8);
            player.role = "";
          } else if (player.role == "called") {
            player.points.push(4);
            player.role = "";
          } else {
            player.points.push(-4);
          }
          colPlay[player.id].innerHTML += `<p>${
            player.points[player.points.length - 1]
          }</p>`;
        }
        data.selected = false;
        localStorage.setItem("local", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("local"));
        location.reload();
      } else if (
        data.score[data.score.length - 1] > 110 &&
        data.score[data.score.length - 1] < 120 &&
        data.selected == true
      ) {
        for (const player of data.players) {
          if (player.role == "caller") {
            player.points.push(10);
            player.role = "";
          } else if (player.role == "called") {
            player.points.push(5);
            player.role = "";
          } else {
            player.points.push(-5);
          }
          colPlay[player.id].innerHTML += `<p>${
            player.points[player.points.length - 1]
          }</p>`;
        }
        data.selected = false;
        localStorage.setItem("local", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("local"));
        location.reload();
      }
      if (turnPlayer.classList.contains("last")) {
        turnPlayer.classList.remove("your_turn");
        firstPlayer.classList.add("your_turn");
      } else {
        turnPlayer.classList.remove("your_turn");
        turnPlayer.nextElementSibling.classList.add("your_turn");

        console.log(turnPlayer);
      }
    });
    btnLose.addEventListener("click", function () {
      modalWin.classList.remove("modal_win_show");
      modalWin.classList.add("modal_win_hide");
      console.log(data.score[data.score.length - 1]);
      if (
        data.score[data.score.length - 1] > 70 &&
        data.score[data.score.length - 1] < 81 &&
        data.selected == true
      ) {
        for (const player of data.players) {
          if (player.role == "caller") {
            player.points.push(-2);
            player.role = "";
          } else if (player.role == "called") {
            player.points.push(-1);
            player.role = "";
          } else {
            player.points.push(1);
          }
          colPlay[player.id].innerHTML += `<p>${
            player.points[player.points.length - 1]
          }</p>`;
        }
        data.selected = false;
        localStorage.setItem("local", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("local"));
        location.reload();
      } else if (
        data.score[data.score.length - 1] > 80 &&
        data.score[data.score.length - 1] < 91 &&
        data.selected == true
      ) {
        for (const player of data.players) {
          if (player.role == "caller") {
            player.points.push(-4);
            player.role = "";
          } else if (player.role == "called") {
            player.points.push(-2);
            player.role = "";
          } else {
            player.points.push(2);
          }
          colPlay[player.id].innerHTML += `<p>${
            player.points[player.points.length - 1]
          }</p>`;
        }
        data.selected = false;
        localStorage.setItem("local", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("local"));
        location.reload();
      } else if (
        data.score[data.score.length - 1] > 90 &&
        data.score[data.score.length - 1] < 101 &&
        data.selected == true
      ) {
        for (const player of data.players) {
          if (player.role == "caller") {
            player.points.push(-6);
            player.role = "";
          } else if (player.role == "called") {
            player.points.push(-3);
            player.role = "";
          } else {
            player.points.push(3);
          }
          colPlay[player.id].innerHTML += `<p>${
            player.points[player.points.length - 1]
          }</p>`;
        }
        data.selected = false;
        localStorage.setItem("local", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("local"));
        location.reload();
      } else if (
        data.score[data.score.length - 1] > 100 &&
        data.score[data.score.length - 1] < 111 &&
        data.selected == true
      ) {
        for (const player of data.players) {
          if (player.role == "caller") {
            player.points.push(-8);
            player.role = "";
          } else if (player.role == "called") {
            player.points.push(-4);
            player.role = "";
          } else {
            player.points.push(4);
          }
          colPlay[player.id].innerHTML += `<p>${
            player.points[player.points.length - 1]
          }</p>`;
        }
        data.selected = false;
        localStorage.setItem("local", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("local"));
        location.reload();
      } else if (
        data.score[data.score.length - 1] > 110 &&
        data.score[data.score.length - 1] < 120 &&
        data.selected == true
      ) {
        for (const player of data.players) {
          if (player.role == "caller") {
            player.points.push(-10);
            player.role = "";
          } else if (player.role == "called") {
            player.points.push(-5);
            player.role = "";
          } else {
            player.points.push(5);
          }
          colPlay[player.id].innerHTML += `<p>${
            player.points[player.points.length - 1]
          }</p>`;
        }
        data.selected = false;
        localStorage.setItem("local", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("local"));
        location.reload();
      }
    });
  });
}

// IN QUESTA SEZIONE LE FUNZIONI IN CASO DI LOCAL STORAGE ASSENTE
else {
  for (const player of match.players) {
    if (player.id == 0) {
      colPlay[player.id].innerHTML += `
        <h6  id="${player.id}" class="name first your_turn">${player.name}</h6>`;
    } else {
      colPlay[player.id].innerHTML += `
    <h6  id="${player.id}" class="name">${player.name}</h6>`;
    }

    for (const point of player.points) {
      colPlay[player.id].innerHTML += `<p>${point}</p>`;
    }
    var total = player.points.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    actionCol[player.id].innerHTML += `
      <h3 class="total">${total}</h3>
      <button id="${player.id}" class="role">Role</button>
      `;
  }
  var roleAction = document.getElementsByClassName("role");
  for (const roleChoose of roleAction) {
    roleChoose.addEventListener("click", function () {
      if (
        !roleChoose.classList.contains("caller") &&
        !roleChoose.classList.contains("called")
      ) {
        roleChoose.classList.add("caller");
        roleChoose.innerHTML = "Caller";
        match.players[roleChoose.id].role = "caller";
      } else if (roleChoose.classList.contains("caller")) {
        roleChoose.classList.remove("caller");
        roleChoose.classList.add("called");
        roleChoose.innerHTML = "Called";
        match.players[roleChoose.id].role = "called";
        console.log(match);
      } else {
        roleChoose.classList.remove("called");
        roleChoose.innerHTML = "Role";
      }
    });
  }

  for (const roNum of match.round) {
    round.innerHTML += `<p>${roNum}</p>`;
  }
  for (const roCall of match.score) {
    call.innerHTML += `<p>${roCall}</p>`;
  }

  var players = document.getElementsByClassName("name");

  for (const player of players) {
    player.addEventListener("click", function () {
      modalName.classList.remove("modal_name_hide");
      modalName.classList.add("modal_name_show");
      var idName = parseInt(player.id) + 1;
      modalName.innerHTML = `<h2>Player ${idName} Name</h2>
        <form>
            <input type="text" id="input_name" required/>
            <input type="submit" id="name_btn" value="OK"/>
        </form>`;
      const inputName = document.getElementById("input_name");
      var nameBtn = document.getElementById("name_btn");
      nameBtn.addEventListener("click", function () {
        if (inputName.value.length === 0) {
        } else {
          modalName.classList.remove("modal_name_show");
          modalName.classList.add("modal_name_hide");
          match.players[player.id].name = inputName.value;
          localStorage.setItem("local", JSON.stringify(match));
          let data = JSON.parse(localStorage.getItem("local"));
          player.innerHTML = `
           <h6  id="${data.players[player.id].id}" class="name">${
            inputName.value
          }</h6>`;
        }
      });
    });
  }

  score.addEventListener("click", function () {
    modalScore.classList.remove("modal_score_hide");
    modalScore.classList.add("modal_score_show");
    modalScore.innerHTML = `<h2>Andrea chiama</h2>
        <form>
            <input type="text" id="input_score" required/>
            <input type="submit" id="choose_btn" value="OK"/>
        </form>`;
    const inputScore = document.getElementById("input_score");
    var chooseBtn = document.getElementById("choose_btn");
    chooseBtn.addEventListener("click", function () {
      if (inputScore.value.length === 0) {
      } else {
        modalScore.classList.remove("modal_score_show");
        modalScore.classList.add("modal_score_hide");
        match.score.push(inputScore.value);
        match.round.push(match.round.length);
        localStorage.setItem("local", JSON.stringify(match));
        data = JSON.parse(localStorage.getItem("local"));
        round.innerHTML += `<p>${data.round[data.round.length - 1]}</p>`;
        totR.innerHTML = data.round.length - 1;
      }
    });
  });
  //   score.innerHTML = match.score[match.score.length - 1];
  totR.innerHTML = match.round.length - 1;
  scoreBtn.addEventListener("click", function () {
    modalWin.classList.remove("modal_win_hide");
    modalWin.classList.add("modal_win_show");
    modalWin.innerHTML = `<h2>Who Won?</h2>
    <button id="caller_win">CALLER</button>
    <button id="trio_win">TRIO</button> `;
    const btnWin = document.getElementById("caller_win");
    const btnLose = document.getElementById("trio_win");
    btnWin.addEventListener("click", function () {
      modalWin.classList.remove("modal_win_show");
      modalWin.classList.add("modal_win_hide");
      if (
        match.score[match.score.length - 1] > 70 &&
        match.score[match.score.length - 1] < 81
      ) {
        for (const player of match.players) {
          if (player.role == "caller") {
            player.points.push(2);
          } else if (player.role == "called") {
            player.points.push(1);
          } else {
            player.points.push(-1);
          }
        }
      } else {
      }
    });
  });
}
