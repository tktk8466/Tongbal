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
  toggleDiv(PO_CHAT_DIV);
  toggleDiv(PO_CHAT_DIV2);
  toggleDiv(POtable);
} //function

//자식 노드 삭제함수
function removeAllchild(div) {
  while (div.hasChildNodes()) {
    div.removeChild(div.firstChild);
  }
}

//<!--송신자 메시지-->
function newSendDiv(id, text, username, compname) {
  // 1. <div> element 만들기
  const chat = document.createElement("div");
  const icon = document.createElement("div");
  const textbox = document.createElement("div");
  const user_c = document.createElement("div");
  const user_n = document.createElement("div");

  // 2. <div>에 들어갈 text node 만들기
  chat.className = "chat mytext";
  icon.className = "icon";
  textbox.className = "textbox";
  user_c.style = "width:100%; text-align: right; padding-right:25px; font-size: 15px;";
  user_c.append(compname);
  user_n.style = "width:100%; text-align: right; padding-right:28px; font-size: 20px;";
  user_n.append(username);

  // 3. <div>에 text node 붙이기
  textbox.append(text);

  // 4. <body>에 1에서 만든 <div> element 붙이기
  chat.append(textbox);
  id.append(user_c);
  id.append(user_n);
  id.append(chat);
}

//<!--수신자 메시지 창-->
function newReceiveDiv(id, text, username, compname) {
  // 1. <div> element 만들기
  const chat = document.createElement("div");
  const icon = document.createElement("div");
  const textbox = document.createElement("div");
  const user_c = document.createElement("div");
  const user_n = document.createElement("div");
  // 2. <div>에 들어갈 text node 만들기
  chat.className = "chat optext";
  icon.className = "icon";
  textbox.className = "textbox";
  user_c.style = "width:100%; text-align: left; padding-left:25px; font-size: 15px;";
  user_c.append(compname);
  user_n.style = "width:100%; text-align: left; padding-left:28px; font-size: 20px;";
  user_n.append(username);

  // 3. <div>에 text node 붙이기
  textbox.append(text);

  // 4. <body>에 1에서 만든 <div> element 붙이기
  chat.append(textbox);
  id.append(user_c);
  id.append(user_n);
  id.append(chat);
}

// 메세지 발신

function sendMessage(event, key, UserID, UserName, CompName, chat_room, div_id) {
  const textarea = document.getElementById("txt_on_" + key);
  if (event != undefined && textarea.value != undefined) {
    let key = event.key || event.keyCode;
    if (key == "Enter" && textarea.value != "") {
      const fullMessage = JSON.stringify({
        type: "chatMessage",
        msg: textarea.value,
        user_id: UserID,
        user_name: UserName,
        comp_name: CompName,
        chat_room_id: chat_room,
      });
      ws.send(fullMessage);
      newSendDiv(div_id, textarea.value, UserName, CompName);
      textarea.value = "";
    }
  } else if (event == undefined && textarea.value != "") {
    //console.log("event == undefined");
    const fullMessage = JSON.stringify({
      type: "chatMessage",
      msg: textarea.value,
      user_id: UserID,
      user_name: UserName,
      comp_name: CompName,
      chat_room_id: chat_room,
    });
    ws.send(fullMessage);
    newSendDiv(div_id, textarea.value, UserName, CompName);
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

  input2.name = "P_Code";
  input3.name = "P_Name";
  input4.name = "P_Width";
  input5.name = "P_Height";
  input6.name = "P_Unit";
  input7.name = "P_Quan";
  input8.name = "P_Price";
  input9.name = "P_VAT";

  input2.placeholder = "제품코드";
  input3.placeholder = "제품명";
  input4.placeholder = "가로";
  input5.placeholder = "세로";
  input6.placeholder = "단위";
  input7.placeholder = "수량";
  input8.placeholder = "단가";
  input9.placeholder = "부가세";

  const row = my_tbody.insertRow(PO_item_body.rows.length); // 하단에 추가
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  const cell3 = row.insertCell(2);
  const cell4 = row.insertCell(3);
  const cell5 = row.insertCell(4);
  const cell6 = row.insertCell(5);
  const cell7 = row.insertCell(6);
  const cell8 = row.insertCell(7);
  const cell9 = row.insertCell(8);

  cell1.innerHTML = PO_item_body.rows.length;
  cell2.append(input2);
  cell3.append(input3);
  cell4.append(input4);
  cell5.append(input5);
  cell6.append(input6);
  cell7.append(input7);
  cell8.append(input8);
  cell9.append(input9);

  var count = document.getElementById("count");
  count.value = PO_item_body.rows.length;
}

function delete_row() {
  var my_tbody = document.getElementById("PO_item_body");
  if (my_tbody.rows.length < 1) return;
  // my_tbody.deleteRow(0); // 상단부터 삭제
  my_tbody.deleteRow(my_tbody.rows.length - 1); // 하단부터 삭제
  var count = document.getElementById("count");
  count.value = PO_item_body.rows.length;
}
