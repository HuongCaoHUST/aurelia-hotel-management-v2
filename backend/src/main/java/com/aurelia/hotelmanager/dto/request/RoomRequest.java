package com.aurelia.hotelmanager.dto.request;

import com.aurelia.hotelmanager.model.RoomStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RoomRequest {

    @NotBlank
    @Size(max = 20)
    private String roomNumber;

    @NotNull
    @Min(0)
    private Integer floor;

    @NotNull
    private Long roomTypeId;

    private RoomStatus status = RoomStatus.AVAILABLE;

    @Size(max = 500)
    private String notes;
}
