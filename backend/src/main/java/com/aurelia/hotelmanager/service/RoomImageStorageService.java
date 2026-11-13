package com.aurelia.hotelmanager.service;

import com.aurelia.hotelmanager.model.Room;
import com.aurelia.hotelmanager.model.RoomPhoto;
import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.StatObjectArgs;
import io.minio.StatObjectResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.InputStream;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomImageStorageService {

    private static final Map<String, String> EXTENSIONS = Map.of(
            "image/jpeg", "jpg",
            "image/png", "png",
            "image/gif", "gif",
            "image/webp", "webp");

    private final MinioClient minioClient;

    @Value("${minio.bucket}")
    private String bucket;

    @Value("${minio.room-image-max-file-size:104857600}")
    private long maxFileSize;

    public StoredImage upload(Room room, MultipartFile file) {
        String contentType = validate(file);
        ensureBucketExists();

        String objectKey = "rooms/" + room.getId() + "/"
                + UUID.randomUUID() + "." + EXTENSIONS.get(contentType);
        putObject(objectKey, file, contentType);

        return new StoredImage(
                objectKey,
                contentType,
                file.getSize(),
                normalizeFilename(file.getOriginalFilename()));
    }

    public RoomImageFile open(RoomPhoto photo) {
        try {
            StatObjectResponse stat = minioClient.statObject(StatObjectArgs.builder()
                    .bucket(bucket)
                    .object(photo.getObjectKey())
                    .build());
            GetObjectResponse stream = minioClient.getObject(GetObjectArgs.builder()
                    .bucket(bucket)
                    .object(photo.getObjectKey())
                    .build());
            return new RoomImageFile(stream, stat.contentType() != null
                    ? stat.contentType()
                    : photo.getContentType(), stat.size());
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Could not load room image from MinIO", exception);
        }
    }

    public void delete(String objectKey) {
        if (objectKey == null || objectKey.isBlank()) return;
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectKey)
                    .build());
        } catch (Exception exception) {
            log.warn("Could not remove room image from MinIO: {}", objectKey, exception);
        }
    }

    private String validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please choose a room image");
        }
        if (file.getSize() > maxFileSize) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE,
                    "Each room image must not exceed " + (maxFileSize / (1024 * 1024)) + " MB");
        }

        String contentType = file.getContentType() == null
                ? ""
                : file.getContentType().toLowerCase(Locale.ROOT);
        if (!EXTENSIONS.containsKey(contentType)) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "Room images must be JPEG, PNG, GIF or WebP");
        }
        return contentType;
    }

    private void ensureBucketExists() {
        try {
            if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build())) {
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                        "MinIO bucket does not exist: " + bucket);
            }
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Could not connect to MinIO", exception);
        }
    }

    private void putObject(String objectKey, MultipartFile file, String contentType) {
        try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectKey)
                    .stream(inputStream, file.getSize(), -1)
                    .contentType(contentType)
                    .build());
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Could not upload room image to MinIO", exception);
        }
    }

    private String normalizeFilename(String filename) {
        if (filename == null || filename.isBlank()) return null;
        String normalized = filename.replace('\\', '/');
        normalized = normalized.substring(normalized.lastIndexOf('/') + 1).trim();
        return normalized.length() > 255 ? normalized.substring(0, 255) : normalized;
    }

    public record StoredImage(
            String objectKey,
            String contentType,
            Long fileSize,
            String originalFilename) {
    }

    public record RoomImageFile(InputStream stream, String contentType, long size) {
    }
}
