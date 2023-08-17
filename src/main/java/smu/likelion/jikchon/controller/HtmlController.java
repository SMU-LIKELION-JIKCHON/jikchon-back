package smu.likelion.jikchon.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HtmlController {

    @GetMapping("/login")
    public String getLoginPage() {
        return "/html/login.html";
    }

    @GetMapping("/cart")
    public String getCart() {
        return "/html/cart.html";
    }

    @GetMapping("/interest-product")
    public String getInterestProduct() {
        return "/html/interest-product.html";
    }

    @GetMapping
    public String getMainHome() {
        return "/html/main-home1.html";
    }

    @GetMapping("/product")
    public String getProduct() {
        return "/html/main-home2.html";
    }

    @GetMapping("/customer/checkorder")
    public String getCustomerCheckOrder() {
        return "/html/mypage_con_checkOrder.html";
    }

    @GetMapping("/customer/recommend")
    public String grtCustomerRecommend() {
        return "/html/mypage_con_recommend.html";
    }

    @GetMapping("/mypage/customer")
    public String getCustomerMypage() {
        return "/html/mypage_customer.html";
    }

    @GetMapping("/mypage/seller")
    public String getSellerMypage() {
        return "/html/mypage_seller.html";
    }

    @GetMapping("/seller/checkorder")
    public String getSellerCheckorder() {
        return "/html/mypage_sell_checkOrder.html";
    }

    @GetMapping("/seller/enrollItem")
    public String getSellerEnrollItem() {
        return "/html/mypage_sell_enrollItem.html";
    }


    @GetMapping("/payment/completed")
    public String getPaymentCompleted() {
        return "/html/payment-completed.html";
    }

    @GetMapping("/product/info")
    public String getProductInfo() {
        return "/html/product-info.html";
    }

    @GetMapping("/product/manage")
    public String getProductManage() {
        return "/html/product-manage.html";
    }

    @GetMapping("/signup/customer")
    public String getRegisterCustomer() {
        return "/html/register_customer.html";
    }

    @GetMapping("/signup/edit/customer")
    public String getRegisterEditCustomer() {
        return "/html/register_edit_customer.html";
    }

    @GetMapping("/signup/edit/seller")
    public String getRegisterEditSeller() {
        return "/html/register_edit_seller.html";
    }

    @GetMapping("/signup/seller")
    public String getRegisterSeller() {
        return "/html/register_seller.html";
    }

    @GetMapping("/receipt/customer")
    public String getShopReceiptCustomer() {
        return "/html/shop_receipt_customer.html";
    }

    @GetMapping("/receipt/seller")
    public String getShopReceiptSeller() {
        return "/html/shop_receipt_seller.html";
    }
}
