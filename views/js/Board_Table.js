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
  document.getElementById("title_PO").value = "";
  document.getElementById("Comp_NAME").value = "";
  document.getElementById("President_NAME").value = "";
  document.getElementById("Business_Address").value = "";
  document.getElementById("TEL").value = "";
  document.getElementById("FAX").value = "";

  document.getElementById("Comp_NAME_2").value = "";
  document.getElementById("President_NAME_2").value = "";
  document.getElementById("Business_NUM").value = "";
  document.getElementById("Business_Address_2").value = "";
  document.getElementById("Business_Address_F").value = "";
  document.getElementById("Sectors").value = "";
  document.getElementById("TEL2").value = "";
  document.getElementById("Fax2").value = "";
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
