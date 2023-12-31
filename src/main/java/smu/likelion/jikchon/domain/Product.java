package smu.likelion.jikchon.domain;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import smu.likelion.jikchon.domain.enumurate.Category;
import smu.likelion.jikchon.domain.enumurate.SubCategory;
import smu.likelion.jikchon.domain.member.Member;
import smu.likelion.jikchon.exception.CustomBadRequestException;
import smu.likelion.jikchon.exception.ErrorCode;

import java.util.List;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String productName;
    Integer price;
    String intro;
    Long quantity;
    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member;
    @Enumerated(EnumType.STRING)
    Category category;
    @Enumerated(EnumType.STRING)
    SubCategory subCategory;

    @OneToMany(mappedBy = "product")
    List<Cart> cartList;
    @OneToMany(mappedBy = "product")
    List<Purchase> purchaseList;
    @OneToMany(mappedBy = "product")
    List<ProductImage> imageList;

    public void reduceQuantity(int purchaseQuantity) {
        if (quantity - purchaseQuantity < 0) {
            throw new CustomBadRequestException(ErrorCode.OUT_OF_STOCK);
        }
        this.quantity -= purchaseQuantity;
    }
    public List<String> getProductImageUrlList(){
        return imageList.stream().map(Image::getImageUrl).collect(Collectors.toList());
    }
}
