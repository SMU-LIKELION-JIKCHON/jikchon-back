var files = [];

document.addEventListener("DOMContentLoaded", function() {
  // enrollItem();
  setCategory();
});

function enrollItem(){
  fetch("http://jikchon.ap-northeast-2.elasticbeanstalk.com/products", {
    method: "GET",
    headers: {
      'Content-Type': "application/json",
      'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
  .then(checkTokenValid(response))
  .then(response => response.json())
  .then(response => {
    console.log(response.data); // 가져온 데이터 처리
  });
}

function setCategory(){
  var bigCategorySelect = document.getElementById("item-big-category");
    var smallCategorySelect = document.getElementById("item-small-category");
    
    // bigCategorySelect의 변경에 따라 smallCategorySelect 옵션을 설정하는 함수
    bigCategorySelect.addEventListener("change", function() {
      var selectedValue = bigCategorySelect.value;
      smallCategorySelect.innerHTML = "";
      
      if (selectedValue === "농산물") {
        populateSmallCategory(["과일", "채소", "버섯","곡물","건농산물"]);
      } else if (selectedValue === "축산물") {
        populateSmallCategory(["소", "돼지", "닭/오리/알류","육가공륙"]);
      }else if (selectedValue === "수산물") {
        populateSmallCategory(["생선류", "건어물", "김/해조류","해산물/어패류","수산가공물"]);
      }else if (selectedValue === "가공식품") {
        populateSmallCategory(["앙념류", "반찬류", "유제품"]);
      }
    });
    
    function populateSmallCategory(categories) {
      categories.forEach(function(category) {
        var option = document.createElement("option");
        option.value = category;
        option.text = category;
        smallCategorySelect.appendChild(option);
      });
    }
}

//이미지 여러장으로 받아내기!
function loadFiles(event) {
  var imageContainer = document.getElementById("image-container");
  imageContainer.innerHTML = '';
  imageContainer.style.background = "none";

  files = event.target.files;
  for (var i = 0; i < files.length; i++) {
    var reader = new FileReader();
    reader.onload = function(event) {
      var img = document.createElement("img");
      img.classList.add('item-img');
      img.setAttribute("src", event.target.result);
      img.style.width = 10/i+"rem";
      img.style.height = 10/i+"rem";
      img.style.margin = '0.1rem';
      imageContainer.appendChild(img);
    };
    reader.readAsDataURL(files[i]);
  }
}

  function submit(){
    var productName = document.getElementById('item-name').value;
    var smallCategory = document.getElementById('item-small-category').value;
    var price = document.getElementById('item-price').value;
    var quantity = document.getElementById('item-amount').value;
    var intro = document.getElementById('item-detailed').value;

    const fileInput = document.getElementById("item-image")

    const itemRequest = {
        'productName': productName,
        'price' : price,
        'quantity' : quantity,
        'smallCategory':smallCategory,
        'intro' : intro
    }

    const formData = new FormData();
    for (var i = 0; i < files.length; i++) {
      formData.append('productImageList', files[i]);
    }
    formData.append(
      'productRequestDto',
        new Blob([JSON.stringify(itemRequest)],{
            type:'application/json'
        })
    );

    console.log(formData);
    var myHeaders = new Headers();
    const url = "http://jikchon.ap-northeast-2.elasticbeanstalk.com/products";
    const token = localStorage.getItem('access_token');
    myHeaders.append('Authorization','Bearer'+token);

    fetch(url,{
        headers: myHeaders,
        body:formData,
        method: "POST"
    })
    .then((Response)=>Response.json())
    .then((result)=>console.log(result))
    .catch((error)=>{
        console.error(error);
    })
    console.log("전송완료 : ",files)
    moveChangePage();
  }

  function moveChangePage(){
    alert("등록이 완료되었습니다.");
    window.location.href = "../html/product-manage.html";
}