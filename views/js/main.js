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

  //<!-- const div = document.getElementById('chat_tables'); -->

  if (chat_tables.childElementCount != 0) {
    removeAllchild(chat_tables); //자식으로 div가 있으면 삭제(다른 테이블 값이 들어왔을때, 채팅방 내용두 달라야해서 원래 있는 채팅방의 내용을 삭제)
  }
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
function createDiv() {
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

  const newText = document.getElementById("txt_on").value;

  // 3. <div>에 text node 붙이기
  newDiv3.append(newText);
  newDiv2.append(I1);

  // 4. <body>에 1에서 만든 <div> element 붙이기
  newDiv.append(newDiv2);
  newDiv.append(newDiv3);
  chat_tables.append(newDiv);

  //아래 구조로 만들어서 채팅방에 쏘는 것임.
  //<div class = "chat ch2">
  //	<div class = "icon">
  //		<i class = "textbox">txt_on에 친 내용이 여기에 들어감</i>
  //
  //	</div>
  //</div>

  del_input(txt_on);
}
// 버튼 클릭이나 엔터로 문자를 쏘앗을 경우 input안에 글씨 지워 주는거
function del_input(del_input_data) {
  del_input_data.value = "";
}

//<!--수신자 메시지 창-->
function createDiv2(dix) {
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

  const newText = dix;

  // 3. <div>에 text node 붙이기
  newDiv3.append(dix);
  newDiv2.append(I1);
  // 4. <body>에 1에서 만든 <div> element 붙이기
  newDiv.append(newDiv2);
  newDiv.append(newDiv3);
  chat_tables.append(newDiv);
}

function On_enter() {
  if (event.keyCode == 13) {
    createDiv();
  }
}
// 메세지 발신
function sendMessage() {
  const message = document.getElementById("txt_on").value;
  const fullMessage = document.getElementById("txt_on").value;
  ws.send(fullMessage);
  createDiv();
  document.getElementById("txt_on").value = "";
}
// 메세지 수신

function submitTextarea(event) {
  let key = event.key || event.keyCode;

  if ((key === "Enter" && !event.shiftKey) || (key === 13 && key !== 16)) {
    event.preventDefault();
    sendMessage();
    return false;
  }
}

function enterkey() {
  const textarea = document.getElementById("txt_on");
  textarea.addEventListener("keyup", (event) => submitTextarea(event));
}

function receiveMessage(event) {
  const message = document.createTextNode(event.data);
  console.log(event);
  createDiv2(message);
}
