package com.ssafy.backend.domain.aichat.entity;

import com.ssafy.backend.domain.aichat.entity.enums.AiChatSender;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
public class AiChatHistory {

    @Id
    @Column(columnDefinition = "INT UNSIGNED")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ai_chat_room_id")
    private AiChatRoom aiChatRoom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AiChatSender sender;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @OneToOne(mappedBy = "aiChatHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    private AiChatFeedback aiChatFeedback;

}
