document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    // 여기에 배포된 Cloud Function의 URL을 입력하세요!
    // 예: https://asia-northeast3-corolla-465317.cloudfunctions.net/ai-assistant-chatbot
    const cloudFunctionUrl = 'https://asia-northeast3-corolla-465317.cloudfunctions.net/ai-assistant-chatbot'; // 이 부분을 사용자님의 함수 URL로 변경하세요!

    // 메시지를 채팅창에 추가하는 함수
    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // 스크롤을 최하단으로
    }

    // 메시지 전송 처리 함수
    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return; // 빈 메시지는 전송하지 않음

        addMessage(message, 'user'); // 사용자 메시지를 채팅창에 추가
        userInput.value = ''; // 입력 필드 초기화

        try {
            const response = await fetch(cloudFunctionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.error || 'Unknown error'}`);
            }

            const data = await response.json();
            addMessage(data.response, 'bot'); // 챗봇 응답을 채팅창에 추가

        } catch (error) {
            console.error('Error sending message:', error);
            addMessage(`오류 발생: ${error.message}`, 'bot'); // 오류 메시지 표시
        }
    }

    // 전송 버튼 클릭 이벤트
    sendButton.addEventListener('click', sendMessage);

    // Enter 키 입력 이벤트
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // 초기 챗봇 환영 메시지
    addMessage("안녕하세요! Gemini 챗봇입니다. 무엇을 도와드릴까요?", 'bot');
});

