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
    const fullMessage = JSON.stringify({ type: "chatMessage", msg: textarea.value, user_id: UserID, user_name: UserName, chat_room_id: chat_room });
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
