package smu.likelion.jikchon.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import smu.likelion.jikchon.base.BaseResponse;
import smu.likelion.jikchon.base.PageResult;
import smu.likelion.jikchon.dto.product.ProductRequestDto;
import smu.likelion.jikchon.dto.product.ProductReturnDto;
import smu.likelion.jikchon.service.ProductService;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;


    @GetMapping("/home/products")
    @PreAuthorize("isAuthenticated()")
    public BaseResponse<ProductReturnDto.Multiple> getRecommendProductList() {
        return BaseResponse.ok(productService.getRecommendProductList());
    }

    @GetMapping("/products")
    public BaseResponse<PageResult<ProductReturnDto.Simple>> getSellerProduct(
            @RequestParam(required = false, value = "category", defaultValue = "") Integer categoryId,
            @PageableDefault(size = 12) Pageable pageable) {
        return BaseResponse.ok(productService.getProductListByCategory(categoryId, pageable));
    }

    //등록 프로덕트 목록 조회
    @GetMapping("/members/products")
    @PreAuthorize("hasRole('SELLER')")
    public BaseResponse<PageResult<ProductReturnDto.Simple>> getSellerProduct(@PageableDefault(size = 12) Pageable pageable) {
        return BaseResponse.ok(productService.getAllProduct(pageable));
    }

    //프로덕트 상세 조회
    @GetMapping("/products/{productId}")
    public BaseResponse<ProductReturnDto.Detail> getDetailProduct(@PathVariable("productId") Long id) {
        return BaseResponse.ok(productService.findById(id));
    }

    //프로덕트 등록
    @PostMapping("/products")
    @PreAuthorize("hasRole('SELLER')")
    public BaseResponse<Void> registerProduct(@RequestPart ProductRequestDto productRequestDto,
                                              @RequestPart List<MultipartFile> productImageList) {
        productService.save(productRequestDto, productImageList);
        return BaseResponse.ok();
    }

    //프로덕트 수정
    @PutMapping ("/products/{productId}")
    @PreAuthorize("hasRole('SELLER')")
    public BaseResponse<Void> updateProduct(@PathVariable("productId") Long id, @RequestPart ProductRequestDto productRequestDto,@RequestPart List<MultipartFile> productImageList) {
        productService.updateProduct(id, productRequestDto,productImageList);
        return BaseResponse.ok();
    }

    //프로덕트 삭제
    @DeleteMapping("/products/{productId}")
    @PreAuthorize("hasRole('SELLER')")
    public BaseResponse<Void> deleteProduct(@PathVariable("productId") Long id) {
        productService.delete(id);
        return BaseResponse.ok();
    }
}
