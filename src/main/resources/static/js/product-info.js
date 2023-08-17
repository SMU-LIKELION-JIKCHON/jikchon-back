import { checkTokenValid, checkTokenExistence } from './common/jwt_token_check.js';

let fetchData = [];

/* Header 설정 */
const token = localStorage.getItem('access_token');
var myHeaders = new Headers();
myHeaders.append('Content-Type', 'application/json');

// prod id 받아오기
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
console.log(categoryId);

function loadProdData() {
    var url = `/products/${productId}`
    /* 통신용 코드 */
    fetch(url, {
        method: "GET",
        headers: myHeaders,
    })
        .then((response) => response.json())
        .then((data) => {
            let data1 = data.data;
            fetchData = data1;
        })
        .catch((error) => {
            console.error('An error occurred while loading store data:', error);
        });
}

function renderProdData(data) {
    // prod-info 섹션 요소를 가져옴
    const prodInfoSection = document.getElementById("prod-info");

    // 데이터를 사용하여 섹션 내부의 내용을 변경
    const imgElement = prodInfoSection.querySelector(".prod-img");
    imgElement.src = data.imageSrc;

    const brandElement = prodInfoSection.querySelector(".brands");
    brandElement.textContent = data.brandName;

    const productNameElement = prodInfoSection.querySelector(".prod-name1");
    productNameElement.textContent = data.productName;

    const addressElement = prodInfoSection.querySelector(".address");
    addressElement.textContent = data.address;

    const priceElement = prodInfoSection.querySelector(".price");
    priceElement.textContent = data.price;
}

function decreaseQuantity() {
    const quantityInput = document.querySelector(".quantity-input");
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

function increaseQuantity() {
    const quantityInput = document.querySelector(".quantity-input");
    const currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
}

function buy_postFormData() {
    if (checkTokenExistence()) {
        var teadbear = 'Bearer ' + token;
        const quantityInput = document.querySelector(".quantity-input");
        var postUrl = "/purchases";

        var formData = {
            id: fetchData.id,
            quantity: quantityInput.value
        };

        console.log(formData);

        /* 통신용 코드 */
        fetch(postUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": teadbear
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("구매 요청이 실패하였습니다.");
                }
                return response.json();
            })
            .then(data => {
                console.log("구매 요청이 성공적으로 전송되었습니다.", data);
                window.location.href = `../html/payment-completed.html`;
            })
            .catch(error => {
                console.error(error);
            });
    }
    else {
        alert("로그인 후 구매해 주세요!");
        window.location.href = "../html/login.html";
    }
}

function cart_postFormData() {
    if (checkTokenExistence()) {
        const cartButton = document.querySelector(".cart-btn");
        const quantityInput = document.querySelector(".quantity-input");
        var teadbear = 'Bearer ' + token;
        var postUrl = `/products/${productId}/cart`

        var formData = {
            id: fetchData.id,
            quantity: quantityInput.value
        };

        console.log(formData);
        /* 통신용 코드 */
        fetch(postUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": teadbear
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("구매 요청이 실패하였습니다.");
                }
                return response.json();
            })
            .then(data => {
                console.log("요청이 성공적으로 전송되었습니다.");
                alert("장바구니에 상품이 성공적으로 담겼습니다!");
            })
            .catch(error => {
                console.error(error);
            });
    }
    else {
        alert("로그인 후 구매해 주세요!");
        window.location.href = "../html/login.html";
    }

}

window.onload = function main() {
    checkTokenValid();
    loadProdData();
    renderProdData(fetchData);
}