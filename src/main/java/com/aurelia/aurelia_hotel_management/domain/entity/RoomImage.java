package com.aurelia.aurelia_hotel_management.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "room_images", indexes = @Index(name = "idx_room_images_room", columnList = "room_id"))
@Getter @Setter @NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoomImage extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "room_id", nullable = false, foreignKey = @ForeignKey(name = "fk_room_images_room")) @ToString.Exclude private Room room;
    @Column(name = "object_key", nullable = false, unique = true, length = 512) private String objectKey;
    @Column(name = "bucket_name", nullable = false, length = 100) private String bucketName;
    @Column(name = "file_name", nullable = false, length = 255) private String fileName;
    @Column(name = "content_type", nullable = false, length = 100) private String contentType;
    @Column(name = "file_size", nullable = false) private Long fileSize;
}
