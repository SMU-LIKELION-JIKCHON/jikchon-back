const REGEX_PHONENUMBER = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/; // 앞자리가 01이며 (0,1,6,7,8,9) 이며 중간에 3~4자리, 세번째는 4자리인 전화번호
const REGEX_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // 영어와 숫자를 포함한 8자리 이상의 비밀번호

const inputUserID = document.getElementById('phoneNumber');
const inputUserPW = document.getElementById('password');
const btnLogin = document.getElementById('login-button');
const btnRegister = document.getElementById('register-button');

const modalScreen = document.querySelector('.modal');
const btnCloseModal = document.querySelector('.modal-close-button');
const btnGoSellerRegister = document.querySelector('.left-button');
const btnGoCustomerRegister = document.querySelector('.right-button');

function login() {
  const userID = inputUserID.value;
  const userPW = inputUserPW.value;

  if (userID === '' || userPW === '') {
    window.alert('아이디와 비밀번호를 모두 입력해 주세요.');
  } else if (!REGEX_PHONENUMBER.test(userID)) {
    window.alert('올바른 전화번호를 입력해 주세요.');
  } else if (!REGEX_PASSWORD.test(userPW)) {
    window.alert('올바른 비밀번호를 입력해 주세요.');
  } else {
    fetch('/members/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: userID,
        password: userPW,
      }),
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(error);
      }
    })
    .then(response => {
        localStorage.setItem('access_token', response.data.token);
        localStorage.setItem('expires_in', response.data.expiresIn);
        localStorage.setItem('user_role', response.data.role);
        window.alert('로그인에 성공하였습니다.');
        window.location.href = '/main-home1';
    })
    .catch(error => {
      console.error('Error:', error)
      window.alert(`${response.status}: 로그인에 실패하였습니다.`);
    });
  }
}

function register() {
  modalScreen.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

btnLogin.addEventListener('click', login);
btnRegister.addEventListener('click', register);

btnCloseModal.addEventListener('click', () => {
  modalScreen.style.display = 'none';
  document.body.style.overflow = 'auto';
});

btnGoSellerRegister.addEventListener('click', () => {
  window.location.href = '../html/register_seller.html';
});

btnGoCustomerRegister.addEventListener('click', () => {
  window.location.href = '../html/register_customer.html';
});

