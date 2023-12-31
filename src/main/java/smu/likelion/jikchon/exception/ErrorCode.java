package smu.likelion.jikchon.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    /**
     * 성공 코드
     */
    OK(200, "요청이 정상적으로 수행되었습니다."),

    /**
     * 400 BAD REQUEST
     */
    BAD_REQUEST(400,"잘못된 요청입니다."),
    INVALID_PARAMETER(40001, "요청 파라미터 오류"),
    DUPLICATE_PHONE_NUMBER(40002, "전화번호 중복"),
    NOT_VERIFIED_COMPANY_NUMBER(40003,"사업자 등록 번호 인증을 진행해주세요."),
    DUPLICATE_UNIQUE_KEY(40004, "UNIQUE 컬럼이 중복 됨"),
    OUT_OF_STOCK(40006,"재고가 부족합니다"),
    INVALID_FILE_TYPE(40007,"파일 타입이 잘못되었습니다."),


    /**
     * 401
     */
    EXPIRED_TOKEN(40101, "토큰 유효 시간이 만료되었습니다"),
    INVALID_TOKEN(40102, "유효하지 않은 토큰입니다."),
    LOGIN_REQUIRED(40103, "토큰이 존재하지 않습니다. 로그인 이후 요청해주세요"),
    REFRESH_TOKEN_NOT_EXIST(40104, "리프레쉬 토큰이 존재하지 않습니다"),

    /**
     * 401
     */
    FORBIDDEN(403, "권한이 없습니다."),
    DUPLICATE_COMPANY_NUMBER(40301, "이미 사용중인 사업자 번호입니다."),
    /**
     * * 403
     */
    NONEXISTENT_BUSINESS_REGISTRATION_CODE(40302, "사업자 등록번호가 존재하지 않습니다."),
    /**
     * 404 NOT FOUND
     */
    NOT_FOUND(404, "요청한 자원을 찾을 수 없습니다."),
    NOT_FOUND_MEMBER(40401, "존재하지 않는 사용자 정보입니다"),
    NOT_FOUND_REVIEW(40402, "존재하지 않는 리뷰입니다"),
    NOT_FOUND_CART(40403, "존재하지 않는 장바구니 품목입니다."),
    NOT_FOUND_ORDER(40404, "존재하지 않는 주문 번호입니다."),
    NOT_FOUND_PRODUCT(40405,"물건을 찾을 수 없습니다"),
    NOT_FOUND_PURCHASE(40406,"구매 물건을 찾을 수 없습니다."),



    /**
     * 500 서버에러
     */
    INTERNAL_SERVER_ERROR(500, "서버 오류입니다."),
    OPEN_API_ERROR(50001, "오픈 API 호출에 오류가 있습니다.");

    private final int code;
    private final String message;
}
