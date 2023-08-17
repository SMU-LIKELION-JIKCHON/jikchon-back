import { checkTokenExistence, checkTokenValid } from "./common/jwt_token_check";

document.addEventListener("DOMContentLoaded", function() {
    // con_checkOrders();
    getOrders();
});

function con_checkOrders(){
    if(!checkTokenExistence()){
        window.alert('로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.');
        window.location.href = './login.html';
    }else {
        if (checkUserRole() !== 'customer') {
          window.alert('잘못된 접근입니다.');
          window.location.href = './main-home1.html';
          return;
        }
    }
    checkTokenValid();
    fetch("/customer/purchases?page=0", {
        method: "GET",
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then(response => response.json())
      .then(response => {
        console.log(response.data); // 가져온 데이터 처리
      });
}
function getOrders(){
    var data = {
        // currentPage:0,
        // pageSize : 20,
        // totalElements:1,
        // content : [
        //     {
        //         id:"1",
        //         imageUrlList:["../images/apple.png","../images/eggs.png","../images/cabbage.png"],
        //         orderDate:"2023.01.01",
        //         price: "00000원"
        //     },
        //     {
        //         id:"2",
        //         imageUrlList:["../images/eggs.png","../images/garlic.png","../images/milk.png"],
        //         orderDate:"2023.02.02",
        //         price:"11111원"
        //     }
        // ]
    }
    

    const url = '/customer/purchases?page=0';
    var myHeaders = new Headers();
    const token = localStorage.getItem('access_token');
    myHeaders.append('Authorization','Bearer'+token); 
    fetch(url,{
        headers:myHeaders,
        method:"GET",
    })
    .then((response)=>{
        return response.json();
    })
    .then(date => {
        if(data.httpStatus==='OK'){
            data = data;
        } else {
            console.error("데이터 가져오기 실패");
        }
    })
    .catch((error)=>{
        console.error("오류발생",error);
    });
    
    setOrderList(data);
}

function formatOrderNumber(orderNumber) {
    orderNumber = orderNumber.toString();
    while (orderNumber.length < 8) {
      orderNumber = '0' + orderNumber;
    }
    
    return orderNumber;
}

function setOrderList(data){
    var orderList= document.getElementById("order-list");

    orders = data.content;
    orders.forEach(function(order){
        var orderBox = document.createElement("div");
        orderBox.classList.add("order-box");

        var leftBox = document.createElement("div");
        leftBox.classList.add("order-box-left");

        var orderNumber = document.createElement("p");
        orderNumber.classList.add("order-number");
        orderNumber.textContent = "주문번호 " + formatOrderNumber(order.id);

        var itemImageBox = document.createElement("div");
        itemImageBox.classList.add("item-image-box");

        order.imageUrlList.forEach(function(imageSrc){
            var itemImage = document.createElement("img")
            itemImage.classList.add("item-image");
            itemImage.src = imageSrc;
            itemImageBox.appendChild(itemImage);
        });
        leftBox.appendChild(orderNumber);
        leftBox.appendChild(itemImageBox);

        var rightBox = document.createElement("div");
        rightBox.classList.add("order-box-right");

        var orderDate = document.createElement("p");
        orderDate.classList.add("order-date");
        orderDate.textContent = order.orderDate;

        var orderPrice = document.createElement("p");
        orderPrice.classList.add("order-price");
        orderPrice.textContent = order.price;

        var orderDetailLink = document.createElement("a");
        orderDetailLink.href = '/customer/receipt/?id='+order.id // 자세히 보기에 연결된 링크

        var orderDetail = document.createElement("p");
        orderDetail.classList.add('order-detail');
        orderDetail.textContent = "자세히보기";

        orderDetailLink.appendChild(orderDetail);

        rightBox.appendChild(orderDate);
        rightBox.appendChild(orderPrice);
        rightBox.appendChild(orderDetailLink);
        
        orderBox.appendChild(leftBox);
        orderBox.appendChild(rightBox);
        orderList.appendChild(orderBox);

    });
}
