package com.aurelia.hotelmanager.service;

import com.aurelia.hotelmanager.dto.response.AvatarResponse;
import com.aurelia.hotelmanager.model.User;
import com.aurelia.hotelmanager.repository.UserRepository;
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

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AvatarStorageService {

    private static final Map<String, String> EXTENSIONS = Map.of(
            "image/jpeg", "jpg",
            "image/png", "png",
            "image/gif", "gif",
            "image/webp", "webp");

    private final MinioClient minioClient;
    private final UserRepository userRepository;

    @Value("${minio.bucket}")
    private String bucket;

    @Value("${minio.max-file-size:5242880}")
    private long maxFileSize;

    public AvatarResponse upload(User user, MultipartFile file, String downloadUrl) {
        String contentType = validate(file);
        ensureBucketExists();

        String objectKey = "avatars/" + user.getId() + "/"
                + UUID.randomUUID() + "." + EXTENSIONS.get(contentType);
        String previousObjectKey = user.getAvatarObjectKey();

        putObject(objectKey, file, contentType);

        try {
            user.setAvatarObjectKey(objectKey);
            user.setAvatarContentType(contentType);
            userRepository.save(user);
        } catch (RuntimeException exception) {
            removeObject(objectKey);
            throw exception;
        }

        if (previousObjectKey != null && !previousObjectKey.equals(objectKey)) {
            removeObject(previousObjectKey);
        }

        return new AvatarResponse(user.getId(), contentType, file.getSize(), downloadUrl);
    }

    public AvatarFile open(User user) {
        if (user.getAvatarObjectKey() == null || user.getAvatarObjectKey().isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tài khoản chưa có avatar");
        }

        try {
            StatObjectResponse stat = minioClient.statObject(StatObjectArgs.builder()
                    .bucket(bucket)
                    .object(user.getAvatarObjectKey())
                    .build());
            GetObjectResponse stream = minioClient.getObject(GetObjectArgs.builder()
                    .bucket(bucket)
                    .object(user.getAvatarObjectKey())
                    .build());
            String contentType = stat.contentType() != null
                    ? stat.contentType()
                    : user.getAvatarContentType();
            return new AvatarFile(stream, contentType, stat.size());
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Không thể tải avatar từ MinIO", exception);
        }
    }

    public void delete(User user) {
        if (user.getAvatarObjectKey() != null && !user.getAvatarObjectKey().isBlank()) {
            removeObject(user.getAvatarObjectKey());
            user.setAvatarObjectKey(null);
            user.setAvatarContentType(null);
            userRepository.save(user);
        }
    }

    private String validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng chọn file avatar");
        }
        if (file.getSize() > maxFileSize) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE,
                    "Avatar không được vượt quá 5 MB");
        }

        String contentType = file.getContentType() == null
                ? ""
                : file.getContentType().toLowerCase(Locale.ROOT);
        if (!EXTENSIONS.containsKey(contentType)) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "Avatar chỉ hỗ trợ JPEG, PNG, GIF hoặc WebP");
        }
        return contentType;
    }

    private void ensureBucketExists() {
        try {
            if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build())) {
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                        "MinIO bucket không tồn tại: " + bucket);
            }
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Không thể kết nối đến MinIO", exception);
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
                    "Không thể upload avatar lên MinIO", exception);
        }
    }

    private void removeObject(String objectKey) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectKey)
                    .build());
        } catch (Exception exception) {
            log.warn("Không thể xóa avatar cũ khỏi MinIO: {}", objectKey, exception);
        }
    }

    public record AvatarFile(InputStream stream, String contentType, long size) {
    }
}
