//input 적은거 새로 읽음
function SetInput() {
  const Company_Name = document.getElementById("Company_Name").value;
  const CEO = document.getElementById("CEO").value;
  const Company_Address = document.getElementById("Company_Address").value;
  const Business_Address = document.getElementById("Business_Address").value;
  const Business = document.getElementById("Business").value;
  const Business_Kind = document.getElementById("Business_Kind").value;
  const Company_Number = document.getElementById("Company_Number").value;
  const Fax = document.getElementById("Fax").value;
}

function reload() {
  (location || window.location || document.location).reload();
}
function Display_none(div) {
  div.style.display = "none";
}
//div전환함수
function toggleDiv(div) {
  if (div.style.display === "none") {
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
}
//테이블 클릭시 div 전환함수
function toggletoggle() {
  //실제 창 전환 함수
  toggleDiv(myDIV);
  toggleDiv(myDIV2);
  toggleDiv(POtable);
} //function

//자식 노드 삭제함수
function removeAllchild(div) {
  while (div.hasChildNodes()) {
    div.removeChild(div.firstChild);
  }
}

//<!--송신자 메시지-->
function newSendDiv(id, text) {
  // 1. <div> element 만들기
  const newDiv = document.createElement("div");
  const newDiv2 = document.createElement("div");
  const newDiv3 = document.createElement("div");
  const I1 = document.createElement("i");

  // 2. <div>에 들어갈 text node 만들기
  newDiv.className = "chat ch2";

  newDiv2.className = "icon";
  newDiv3.className = "textbox";
  I1.className = "fa-solid fa-user";

  const newText = text;

  // 3. <div>에 text node 붙이기
  newDiv3.append(newText);
  newDiv2.append(I1);

  // 4. <body>에 1에서 만든 <div> element 붙이기
  newDiv.append(newDiv2);
  newDiv.append(newDiv3);
  id.append(newDiv);

  //아래 구조로 만들어서 채팅방에 쏘는 것임.
  //<div class = "chat ch2">
  //	<div class = "icon">
  //		<i class = "textbox">txt_on에 친 내용이 여기에 들어감</i>
  //
  //	</div>
  //</div>
}

//<!--수신자 메시지 창-->
function newReceiveDiv(id, text) {
  // 1. <div> element 만들기
  const newDiv = document.createElement("div");
  const newDiv2 = document.createElement("div");
  const newDiv3 = document.createElement("div");
  const I1 = document.createElement("i");

  // 2. <div>에 들어갈 text node 만들기
  newDiv.className = "chat ch1";
  newDiv2.className = "icon";
  newDiv3.className = "textbox";
  I1.className = "fa-solid fa-user";

  const newText = text;

  // 3. <div>에 text node 붙이기
  newDiv3.append(text);
  newDiv2.append(I1);
  // 4. <body>에 1에서 만든 <div> element 붙이기
  newDiv.append(newDiv2);
  newDiv.append(newDiv3);
  id.append(newDiv);
}

// 메세지 발신

function sendMessage(event, key, UserID, UserName, chat_room, div_id) {
  const textarea = document.getElementById("txt_on_" + key);
  if (event != undefined && textarea.value != undefined) {
    let key = event.key || event.keyCode;
    if (key == "Enter") {
      const fullMessage = JSON.stringify({
        type: "chatMessage",
        msg: textarea.value,
        user_id: UserID,
        user_name: UserName,
        chat_room_id: chat_room,
      });
      ws.send(fullMessage);
      newSendDiv(div_id, textarea.value);
      textarea.value = "";
    }
  } else if (event == undefined && textarea.value != undefined) {
    console.log("event == undefined");
    const fullMessage = JSON.stringify({
      type: "chatMessage",
      msg: textarea.value,
      user_id: UserID,
      user_name: UserName,
      chat_room_id: chat_room,
    });
    ws.send(fullMessage);
    newSendDiv(div_id, textarea.value);
    textarea.value = "";
  } else {
    console.log("Main.js :: sendMessage() : message is undefined");
  }
}

// 채팅창 하단으로 스크롤
function scrollBottom(div_id) {
  if (document.getElementById(div_id)) {
    let sp = document.getElementById(div_id);
    sp.scrollTop = sp.scrollHeight;
  } else {
    console.log("scroll none error" + div_id);
  }
}

var tmp_num = 2;
function add_row() {
  var my_tbody = document.getElementById("PO_item_body");
  // var row = my_tbody.insertRow(0); // 상단에 추가
  const input2 = document.createElement("input");
  const input3 = document.createElement("input");
  const input4 = document.createElement("input");
  const input5 = document.createElement("input");
  const input6 = document.createElement("input");
  const input7 = document.createElement("input");
  const input8 = document.createElement("input");
  const input9 = document.createElement("input");
  input2.className = "input_PO_item";
  input3.className = "input_PO_item";
  input4.className = "input_PO_item";
  input5.className = "input_PO_item";
  input6.className = "input_PO_item";
  input7.className = "input_PO_item";
  input8.className = "input_PO_item";
  input9.className = "input_PO_item";
  input2.id = "Cannes_" + tmp_num;
  input3.id = "Products_" + tmp_num;
  input4.id = "B_" + tmp_num;
  input5.id = "SI_" + tmp_num;
  input6.id = "Q_" + tmp_num;
  input7.id = "P_" + tmp_num;
  input8.id = "V_" + tmp_num;
  input9.id = "N_" + tmp_num;
  var row = my_tbody.insertRow(PO_item_body.rows.length); // 하단에 추가
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  var cell7 = row.insertCell(6);
  var cell8 = row.insertCell(7);
  var cell9 = row.insertCell(8);

  cell1.innerHTML = tmp_num;
  tmp_num++;
  cell2.append(input2);
  cell3.append(input3);
  cell4.append(input4);
  cell5.append(input5);
  cell6.append(input6);
  cell7.append(input7);
  cell8.append(input8);
  cell9.append(input9);
}

function delete_row() {
  var my_tbody = document.getElementById("PO_item_body");
  if (my_tbody.rows.length < 1) return;
  // my_tbody.deleteRow(0); // 상단부터 삭제
  tmp_num--;
  my_tbody.deleteRow(my_tbody.rows.length - 1); // 하단부터 삭제
}
