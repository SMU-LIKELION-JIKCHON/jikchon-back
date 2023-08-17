import { checkTokenValid, checkTokenExistence } from './common/jwt_token_check.js';

let fetchdata = []; // Initialize fetchdata array
var url = "/home/products"

/* Header 설정 */
const token = localStorage.getItem('access_token');
var myHeaders = new Headers();
myHeaders.append('Authorization', 'Bearer ' + token);
myHeaders.append('Content-Type', 'application/json');

// 추천 상품 load
function loadRecommendList() {
    if (checkTokenExistence()) {
        fetch(url, {
            headers: myHeaders,
            method: 'GET'
        })
            .then(checkTokenValid(response))
            .then((response) => response.json())
            .then((data) => {
                let data1 = data.data;
                fetchdata = data1;
            })
            .catch((error) => {
                console.error('An error occurred while loading store data:', error);
            });
    }
    else {
        const recommendList = document.querySelector(".recommend-list");
        const intendLogin = document.createElement("p");
        intendLogin.innerHTML = "회원가입 하고 맞춤 상품 보러가기!";
        recommendList.appendChild(intendLogin);
    }
}

// 추천 상품 render
function renderRecommendList(products) {
    const productList = document.getElementById("product-list");
    // 데이터를 기반으로 제품 목록을 생성
    products.forEach(product => {
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${product.imgUrl}" alt="${product.productName}" class="prod-img">
            <div class="prod-info">
                <div class="product">
                    <div class="brands">
                        <p>${product.brand}</p>
                        <img src="../images/cart_icon.svg" class="cart-img" />
                    </div>
                    <div class="prod-name"><p>${product.productName}</p></div>
                </div>
                <div class="price">${product.price}</div>
            </div>
        `;

        li.addEventListener('click', () => {
            const clickedItemId = product.id;
            window.location.href = `../html/product-info.html`;
        })
        productList.appendChild(li);
    })
}

// click 시 해당 카테고리 페이지(main-home2로 이동)
function attachMenuClickEvent() {
    const categoryElems = document.querySelectorAll('.category-elem');
    let pageNum = 0;
    console.log("attach func 진입");

    categoryElems.forEach((elem, index) => {
        elem.addEventListener('click', () => {
            if (index === 0) {
                console.log(0);
                // 농산물 페이지인거 main-home2.js에 넘겨주기 -> 1
                window.location.href = `../html/main-home2.html`;
            }
            else if (index === 1) {
                console.log(1);
                // 축산물 페이지인거 main-home2.js에 넘겨주기 -> 2
                window.location.href = `../html/main-home2.html`;
            }
            else if (index === 2) {
                console.log(2);
                // 해산물 페이지인거 main-home2.js에 넘겨주기 -> 3
                window.location.href = `../html/main-home2.html`;
            }
            else if (index === 3) {
                console.log(3);
                // 가공식품 페이지인거 main-home2.js에 넘겨주기 -> 4
                window.location.href = `../html/main-home2.html`;
            }
        });
        pageNum++;
    });
}

window.onload = function main() {
    attachMenuClickEvent();
    loadRecommendList();
    renderRecommendList(fetchdata);
}


