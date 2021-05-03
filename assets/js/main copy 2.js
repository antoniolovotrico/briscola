let match = {
  cash: 0.25,
  checked: false,
  selected: false,
  round: [0],
  score: [0],
  players: [
    {
      name: "player1",
      points: [0],
      total: 0,
      role: "",
      id: 0,
      ao: "turn",
    },
    {
      name: "player2",
      points: [0],
      total: "",
      role: "",
      id: 1,
      ao: "",
    },
    {
      name: "player3",
      points: [0],
      total: 0,
      role: "",
      id: 2,
      ao: "",
    },
    {
      name: "player4",
      points: [0],
      total: 0,
      role: "",
      id: 3,
      ao: "",
    },
    {
      name: "player5",
      points: [0],
      total: 0,
      role: "",
      id: 4,
      ao: "",
    },
  ],
};

const round = document.getElementById("round");
const call = document.getElementById("call");
const main = document.querySelector("main");
const menuBtn = document.getElementById("menu_btn");
const modalMenu = document.querySelector(".modal_menu_hide");
const modalCash = document.querySelector(".modal_cash_hide");
const modalRank = document.querySelector(".modal_rank_hide");
const modalName = document.querySelector(".modal_name_hide");
const modalScore = document.querySelector(".modal_score_hide");
const modalWin = document.querySelector(".modal_win_hide");
let data = JSON.parse(localStorage.getItem("local"));
const colPlay = document.getElementsByClassName("player");
// const totR = document.getElementById("totR");
const actionCol = document.getElementsByClassName("action");
const scoreBtn = document.getElementById("score_btn");
const check = document.getElementById("check");
const score = document.getElementById("btn_call");

// IN QUESTA SEZIONE LE FUNZIONI IN CASO DI LOCAL STORAGE PRESENTE
if (data) {
  function printA() {
    console.log(this);
  }
  printA();

  data.checked = false;
  data.selected = false;
  menuBtn.addEventListener("click", function () {
    modalMenu.classList.remove("modal_menu_hide");
    modalMenu.classList.add("modal_menu_show");
    modalMenu.innerHTML = `<h2>MENU</h2>
    <form>
        <input type="submit" id="new_match" value="New Match"/>
        <input type="submit" id="reset_round" value="Reset Last Round"/>      
    </form>
    <button id="cash_point">Set Cash Point</button>
    <button id="ranking">Ranking</button>
    <button id="ok_menu">OK</button>`;
    var newMatch = document.getElementById("new_match");
    var resetRound = document.getElementById("reset_round");
    var cashBtn = document.getElementById("cash_point");
    var rankBtn = document.getElementById("ranking");
    var okMenuBtn = document.getElementById("ok_menu");
    okMenuBtn.addEventListener("click", function () {
      modalMenu.classList.remove("modal_menu_show");
      modalMenu.classList.add("modal_menu_hide");
    });
    newMatch.addEventListener("click", function () {
      localStorage.clear();
    });
    resetRound.addEventListener("click", function () {
      data.score.splice(data.score.length - 1, 1);
      data.round.splice(data.round.length - 1, 1);
      data.players[0].points.splice(data.players[0].points.length - 1, 1);
      data.players[1].points.splice(data.players[1].points.length - 1, 1);
      data.players[2].points.splice(data.players[2].points.length - 1, 1);
      data.players[3].points.splice(data.players[3].points.length - 1, 1);
      data.players[4].points.splice(data.players[4].points.length - 1, 1);
      for (const player of data.players) {
        player.role = "";
      }
      data.checked = false;
      data.selected = false;
      localStorage.setItem("local", JSON.stringify(data));
      data = JSON.parse(localStorage.getItem("local"));
    });
    cashBtn.addEventListener("click", function () {
      modalMenu.classList.remove("modal_menu_show");
      modalMenu.classList.add("modal_menu_hide");
      modalCash.classList.remove("modal_cash_hide");
      modalCash.classList.add("modal_cash_show");
      modalCash.innerHTML = `<h2>Choose € per point</h2>
      <form>
          <input type="number" step="0.25" id="money_input" required/>
          <input type="submit" id="money_btn" value="OK"/>
      </form>`;
      var moneyInput = document.getElementById("money_input");
      var moneyBtn = document.getElementById("money_btn");
      moneyBtn.addEventListener("click", function () {
        data.cash = moneyInput.value;
        localStorage.setItem("local", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("local"));
      });
    });
    rankBtn.addEventListener("click", function () {
      modalMenu.classList.remove("modal_menu_show");
      modalMenu.classList.add("modal_menu_hide");
      modalRank.classList.remove("modal_rank_hide");
      modalRank.classList.add("modal_rank_show");
      modalRank.innerHTML += `<h2>Ranking</h2>
      <ol id="ordered_rank"></ol>`;
      var ordRank = document.getElementById("ordered_rank");
      for (const player of data.players) {
        ordRank.innerHTML += `<li>${player.name} \u00A0\u00A0\u00A0 points : ${
          player.total
        } = \u00A0\u00A0\u00A0${player.total * data.cash} €</li>`;
      }
      modalRank.innerHTML += `<button id="ok_rank">OK</button>`;
      var okRankBtn = document.getElementById("ok_rank");
      okRankBtn.addEventListener("click", function () {
        modalRank.classList.remove("modal_rank_show");
        modalRank.classList.add("modal_rank_hide");
        location.reload();
      });
    });
  });

  for (const player of data.players) {
    if (player.ao == "turn") {
      colPlay[player.id].innerHTML += `
        <h6  id="${player.id}" class="name last your_turn">${player.name}</h6>`;
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
    player.total = total;

    actionCol[player.id].innerHTML += `
    <h3 class="total">${total}</h3>
    <button id="${player.id}" onclick="chooseRole(this)" class="role">Role</button>
    `;
  }
  localStorage.setItem("local", JSON.stringify(data));
  data = JSON.parse(localStorage.getItem("local"));
  var roleAction = document.getElementsByClassName("role");

  function chooseRole(element) {
    for (const roleChoose of roleAction) {
      roleChoose.classList[roleChoose === element ? "add" : "remove"]("caller");
      //   if (
      //     !roleChoose.classList.contains("caller") &&
      //     !roleChoose.classList.contains("called")
      //   ) {
      //     roleChoose.classList.add("caller");
      //     roleChoose.innerHTML = "Caller";
      //     data.players[roleChoose.id].role = "caller";
      //     data.selected = true;
      //     console.log(roleAction);
      //   } else if (roleChoose.classList.contains("caller")) {
      //     roleChoose.classList.remove("caller");
      //     roleChoose.classList.add("called");
      //     roleChoose.innerHTML = "Called";
      //     data.players[roleChoose.id].role = "called";
      //   } else {
      //     roleChoose.classList.remove("called");
      //     roleChoose.innerHTML = "Role";
      //     data.players[roleChoose.id].role = "";
      //     data.selected = false;
      //   }
    }
  }

  check.addEventListener("click", function () {
    if (data.checked === false) {
      data.checked = true;
    } else {
      data.checked = false;
    }
  });
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
  //   totR.innerHTML = data.round.length - 1;
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
      } else if (data.score.length > data.players[0].points.length) {
        modalScore.classList.remove("modal_score_show");
        modalScore.classList.add("modal_score_hide");
        data.score.splice(data.score.length - 1, 1, inputScore.value);
        localStorage.setItem("local", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("local"));
      } else {
        modalScore.classList.remove("modal_score_show");
        modalScore.classList.add("modal_score_hide");
        data.score.push(inputScore.value);
        data.round.push(data.round.length);
        localStorage.setItem("local", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("local"));
        round.innerHTML += `<p>${data.round[data.round.length - 1]}</p>`;
        // totR.innerHTML = data.round.length - 1;
      }
      for (const player of data.players) {
        player.role = "";
      }
      data.checked = false;
      data.selected = false;
      localStorage.setItem("local", JSON.stringify(data));
      data = JSON.parse(localStorage.getItem("local"));
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

      if (data.score.length > data.players[0].points.length) {
        for (const player of data.players) {
          if (player.ao === "turn" && player.id !== 4) {
            player.ao = "";
            data.players[player.id + 1].ao = "turn";
            break;
          } else if (player.ao === "turn" && player.id == 4) {
            player.ao = "";
            data.players[0].ao = "turn";
            break;
          }
        }
        if (
          data.score[data.score.length - 1] > 70 &&
          data.score[data.score.length - 1] < 81 &&
          data.selected == true
        ) {
          if (data.checked) {
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
          } else {
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
              colPlay[player.id].innerHTML += `<p>${
                player.points[player.points.length - 1]
              }</p>`;
            }
          }
          data.checked = false;
          data.selected = false;
          localStorage.setItem("local", JSON.stringify(data));
          data = JSON.parse(localStorage.getItem("local"));
          location.reload();
        } else if (
          data.score[data.score.length - 1] > 80 &&
          data.score[data.score.length - 1] < 91 &&
          data.selected == true
        ) {
          if (data.checked) {
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
          } else {
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
          }
          data.checked = false;
          data.selected = false;
          localStorage.setItem("local", JSON.stringify(data));
          data = JSON.parse(localStorage.getItem("local"));
          location.reload();
        } else if (
          data.score[data.score.length - 1] > 90 &&
          data.score[data.score.length - 1] < 101 &&
          data.selected == true
        ) {
          if (data.checked) {
            for (const player of data.players) {
              if (player.role == "caller") {
                player.points.push(12);
                player.role = "";
              } else if (player.role == "called") {
                player.points.push(6);
                player.role = "";
              } else {
                player.points.push(-6);
              }
              colPlay[player.id].innerHTML += `<p>${
                player.points[player.points.length - 1]
              }</p>`;
            }
          } else {
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
          }
          data.checked = false;
          data.selected = false;
          localStorage.setItem("local", JSON.stringify(data));
          data = JSON.parse(localStorage.getItem("local"));
          location.reload();
        } else if (
          data.score[data.score.length - 1] > 100 &&
          data.score[data.score.length - 1] < 111 &&
          data.selected == true
        ) {
          if (data.checked) {
            for (const player of data.players) {
              if (player.role == "caller") {
                player.points.push(16);
                player.role = "";
              } else if (player.role == "called") {
                player.points.push(8);
                player.role = "";
              } else {
                player.points.push(-8);
              }
              colPlay[player.id].innerHTML += `<p>${
                player.points[player.points.length - 1]
              }</p>`;
            }
          } else {
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
          }
          data.checked = false;
          data.selected = false;
          localStorage.setItem("local", JSON.stringify(data));
          data = JSON.parse(localStorage.getItem("local"));
          location.reload();
        } else if (
          data.score[data.score.length - 1] > 110 &&
          data.score[data.score.length - 1] < 120 &&
          data.selected == true
        ) {
          if (data.checked) {
            for (const player of data.players) {
              if (player.role == "caller") {
                player.points.push(20);
                player.role = "";
              } else if (player.role == "called") {
                player.points.push(10);
                player.role = "";
              } else {
                player.points.push(-10);
              }
              colPlay[player.id].innerHTML += `<p>${
                player.points[player.points.length - 1]
              }</p>`;
            }
          } else {
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
          }
          data.checked = false;
          data.selected = false;
          localStorage.setItem("local", JSON.stringify(data));
          data = JSON.parse(localStorage.getItem("local"));
          location.reload();
        }
      }
    });
    btnLose.addEventListener("click", function () {
      modalWin.classList.remove("modal_win_show");
      modalWin.classList.add("modal_win_hide");
      if (data.score.length > data.players[0].points.length) {
        for (const player of data.players) {
          if (player.ao === "turn" && player.id !== 4) {
            player.ao = "";
            data.players[player.id + 1].ao = "turn";
            break;
          } else if (player.ao === "turn" && player.id == 4) {
            player.ao = "";
            data.players[0].ao = "turn";
            break;
          }
        }
        if (
          data.score[data.score.length - 1] > 70 &&
          data.score[data.score.length - 1] < 81 &&
          data.selected == true
        ) {
          if (data.checked) {
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
          } else {
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
          }
          data.checked = false;
          data.selected = false;
          localStorage.setItem("local", JSON.stringify(data));
          data = JSON.parse(localStorage.getItem("local"));
          location.reload();
        } else if (
          data.score[data.score.length - 1] > 80 &&
          data.score[data.score.length - 1] < 91 &&
          data.selected == true
        ) {
          if (data.checked) {
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
          } else {
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
          }
          data.checked = false;
          data.selected = false;
          localStorage.setItem("local", JSON.stringify(data));
          data = JSON.parse(localStorage.getItem("local"));
          location.reload();
        } else if (
          data.score[data.score.length - 1] > 90 &&
          data.score[data.score.length - 1] < 101 &&
          data.selected == true
        ) {
          if (data.checked) {
            for (const player of data.players) {
              if (player.role == "caller") {
                player.points.push(-12);
                player.role = "";
              } else if (player.role == "called") {
                player.points.push(-6);
                player.role = "";
              } else {
                player.points.push(6);
              }
              colPlay[player.id].innerHTML += `<p>${
                player.points[player.points.length - 1]
              }</p>`;
            }
          } else {
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
          }
          data.checked = false;
          data.selected = false;
          localStorage.setItem("local", JSON.stringify(data));
          data = JSON.parse(localStorage.getItem("local"));
          location.reload();
        } else if (
          data.score[data.score.length - 1] > 100 &&
          data.score[data.score.length - 1] < 111 &&
          data.selected == true
        ) {
          if (data.checked) {
            for (const player of data.players) {
              if (player.role == "caller") {
                player.points.push(-16);
                player.role = "";
              } else if (player.role == "called") {
                player.points.push(-8);
                player.role = "";
              } else {
                player.points.push(8);
              }
              colPlay[player.id].innerHTML += `<p>${
                player.points[player.points.length - 1]
              }</p>`;
            }
          } else {
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
          }
          data.checked = false;
          data.selected = false;
          localStorage.setItem("local", JSON.stringify(data));
          data = JSON.parse(localStorage.getItem("local"));
          location.reload();
        } else if (
          data.score[data.score.length - 1] > 110 &&
          data.score[data.score.length - 1] < 120 &&
          data.selected == true
        ) {
          if (data.checked) {
            for (const player of data.players) {
              if (player.role == "caller") {
                player.points.push(-20);
                player.role = "";
              } else if (player.role == "called") {
                player.points.push(-10);
                player.role = "";
              } else {
                player.points.push(10);
              }
              colPlay[player.id].innerHTML += `<p>${
                player.points[player.points.length - 1]
              }</p>`;
            }
          } else {
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
          }
          data.checked = false;
          data.selected = false;
          localStorage.setItem("local", JSON.stringify(data));
          data = JSON.parse(localStorage.getItem("local"));
          location.reload();
        }
      }
    });
  });
}

// IN QUESTA SEZIONE LE FUNZIONI IN CASO DI LOCAL STORAGE ASSENTE
else {
  menuBtn.addEventListener("click", function () {
    modalMenu.classList.remove("modal_menu_hide");
    modalMenu.classList.add("modal_menu_show");
    modalMenu.innerHTML = `<h2>MENU</h2>
        <button id="cash_point">Set Cash Point</button>`;
    var cashBtn = document.getElementById("cash_point");
    cashBtn.addEventListener("click", function () {
      modalMenu.classList.remove("modal_menu_show");
      modalMenu.classList.add("modal_menu_hide");
      modalCash.classList.remove("modal_cash_hide");
      modalCash.classList.add("modal_cash_show");
      modalCash.innerHTML = `<h2>Choose € per point</h2>
          <form>
              <input type="text" id="money_input" required/>
              <input type="submit" id="money_btn" value="OK"/>
          </form>`;
      var moneyInput = document.getElementById("money_input");
      var moneyBtn = document.getElementById("money_btn");
      moneyBtn.addEventListener("click", function () {
        match.cash = moneyInput.value;
        localStorage.setItem("local", JSON.stringify(match));
        data = JSON.parse(localStorage.getItem("local"));
      });
    });
  });
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
    modalScore.innerHTML = `<h2>CALL</h2>
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
        // totR.innerHTML = data.round.length - 1;
      }
    });
  });
  //   score.innerHTML = match.score[match.score.length - 1];
  //   totR.innerHTML = match.round.length - 1;
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
