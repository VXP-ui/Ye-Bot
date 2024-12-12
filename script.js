document.getElementById("sendMessageForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const userMessage = document.getElementById("userMessage").value.trim();

    if (!userMessage) {
        alert("Please enter a message!");
        return;
    }

    const webhookUrl = "YOUR_DISCORD_WEBHOOK_URL";  // Replace with your Discord webhook URL
    const payload = { content: userMessage };

    try {
        await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        alert("Message sent to Discord!");
        fetchMessages();  // Update the displayed messages
    } catch (error) {
        alert("Failed to send message.");
        console.error("Error sending message:", error);
    }
});

async function fetchMessages() {
    try {
        const response = await fetch("https://your-username.github.io/your-repository/messages.json");
        const messages = await response.json();

        const messagesContainer = document.getElementById("messagesContainer");
        messagesContainer.innerHTML = "";  // Clear existing messages

        messages.forEach((message) => {
            const messageElement = document.createElement("div");
            messageElement.classList.add("message");
            messageElement.textContent = message.content;
            messagesContainer.appendChild(messageElement
