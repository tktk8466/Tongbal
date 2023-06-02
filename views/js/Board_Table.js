function Save_PO() {
  if (PO3.style.display === "block") {
    addRow_Purchase_Order_Board();
    Reset_PO();
    F_Board();
  }
}

function Change_PO() {
  PO3.style.display = "block";
  addRow_Purchase_Order_Board();
}

function Reset_PO() {
  PO3.style.display = "block";
  document.getElementById("title_PO").value = "제목을 입력해 주세요.";
  document.getElementById("Comp_NAME").value = "Comp_NAME";
  document.getElementById("Comp_NAME_2").value = "Comp_NAME_2";
  document.getElementById("President_NAME").value = "President_NAME";
  document.getElementById("Business_Address").value = "Business_Address";
  document.getElementById("TEL").value = "TEL";
  document.getElementById("FAX").value = "FAX";
  document.getElementById("President_NAME_2").value = "President_NAME_2";
  document.getElementById("Business_NUM").value = "Business_NUM";
  document.getElementById("Business_Address_2").value = "Business_Address_2";
  document.getElementById("Business_Address_F").value = "Business_Address_F";
  document.getElementById("Manager").value = "Manager";
  document.getElementById("TEL2").value = "TEL2";
  document.getElementById("Fax2").value = "Fax2";
}

function addRow_Purchase_Order_Board() {
  // table element 찾기
  const table = document.getElementById("Purchase_Order_Board"); //여기에 테이블 이름 들어가야합니다.

  // 새 행(Row) 추가
  const newRow = table.insertRow();

  // 새 행(Row)에 Cell 추가
  const newCell1 = newRow.insertCell(0);
  const newCell2 = newRow.insertCell(1);
  const newCell3 = newRow.insertCell(2);
  const newCell4 = newRow.insertCell(3);
  const newCell5 = newRow.insertCell(4);
  const newCell6 = newRow.insertCell(5);
  const newCell7 = newRow.insertCell(6);

  date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Cell에 텍스트 추가
  newCell1.innerText = table.rows.length;
  newCell2.innerText = document.getElementById("title_PO").value;
  newCell3.innerText = document.getElementById("Comp_NAME").value;
  newCell4.innerText = document.getElementById("Comp_NAME_2").value;
  newCell5.innerText = "?";
  newCell6.innerText = year + "-" + month + "-" + day;
  newCell7.innerText = year + "-" + month + "-" + day;
}
