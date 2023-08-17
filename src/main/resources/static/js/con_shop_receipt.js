document.addEventListener("DOMContentLoaded", function() {
    var idValue = getQueryParamValue('id');
    console.log(currentUrl)
    getData(idValue);
    // con_receipt(idValue);
});
function getQueryParamValue(paramName){
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
}
function con_receipt(idValue){
    fetch("http://jikchon.ap-northeast-2.elasticbeanstalk.com/customer/receipt/"+idValue, {
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
function getData(id){
    var data = {
        // orderId: 2,
        // totalPrice : 55000,
        // purchaseList : [
        //     {
        //         id: 1,
        //         productName: "사과",
        //         quantity: 3,
        //         price: 12000
        //     },
        //     {
        //         id : 2,
        //         productName : "소",
        //         quantity: 3,
        //         price : 30000
        //     }
        // ]  
    }
       

    const url = 'http://jikchon.ap-northeast-2.elasticbeanstalk.com/customer/receipt/'+id;
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
    
    setPurchaseList(data);
}

function setPurchaseList(data){

    document.getElementById("buyer-num").textContent = data.orderId;
    document.getElementById("total-price").textContent = data.totalPrice;
    var productBox = document.getElementById("productBox");
    var purchaseLists = data.purchaseList;

    purchaseLists.forEach(function(purchaseList){
        var product = document.createElement("div");
        product.classList.add("product");

        var productName = document.createElement("p");
        productName.classList.add("product-name")
        productName.textContent = purchaseList.productName;

        var productQuantity = document.createElement("p");
        productQuantity.classList.add("product-quantity")
        productQuantity.textContent = purchaseList.quantity;

        var productPrice = document.createElement("p");
        productPrice.classList.add("product-price")
        productPrice.textContent = purchaseList.price;

        product.appendChild(productName);
        product.appendChild(productQuantity);
        product.appendChild(productPrice);

        productBox.appendChild(product);
    });
}