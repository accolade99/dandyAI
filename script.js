document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const userInput = document.getElementById("userInput");
  const chatMessages = document.getElementById("chatMessages");
  const sendButton = document.getElementById("sendButton");

  // Your API key (never share it or upload this file publicly)
  const API_KEY = "AQ.Ab8RN6KpcixEwghyN68bv0NwTkwYWH1def-zeW7-5qTscOVN5A";

  // Current model name (the old gemini-1.5-flash has been discontinued)
  const MODEL = "gemini-2.5-flash";

  // Auto-resize the textarea
  userInput.addEventListener("input", () => {
    userInput.style.height = "auto";
    userInput.style.height = userInput.scrollHeight + "px";
  });

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the browser default form submission

    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, true);

    // Clear the input and disable the send button
    userInput.value = "";
    userInput.style.height = "auto";
    sendButton.disabled = true;

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    try {
      // Generate AI response
      const response = await generateResponse(message);
      typingIndicator.remove(); // Remove typing indicator
      addMessage(response, false); // Add AI response to chat
    } catch (error) {
      typingIndicator.remove(); // Remove typing indicator
      addErrorMessage(error.message); // Show error message
    } finally {
      sendButton.disabled = false; // Re-enable the send button
    }
  });

  // Function to generate AI response
  async function generateResponse(prompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      // Read Google's real error message instead of the vague statusText
      const errorData = await response.json().catch(() => ({}));
      const reason = errorData.error?.message || response.statusText;
      throw new Error(`Failed to generate response (${response.status}): ${reason}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Invalid response format from the API");
    }

    return text;
  }

  // Function to add a message to the chat
  function addMessage(text, isUser) {
    const message = document.createElement("div");
    message.className = `message ${isUser ? "user-message" : ""}`;
    message.innerHTML = `
      <div class="avatar ${isUser ? "user-avatar" : ""}">
        ${isUser ? "U" : "AI"}
      </div>
      <div class="message-content"></div>
    `;
    // textContent treats the text as plain text (safe, can't run as code)
    message.querySelector(".message-content").textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
  }

  // Function to show typing indicator
  function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "message";
    indicator.innerHTML = `
      <div class="avatar">AI</div>
      <div class="typing-indicator">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    return indicator;
  }

  // Function to add an error message to the chat
  function addErrorMessage(text) {
    const message = document.createElement("div");
    message.className = "message";
    message.innerHTML = `
      <div class="avatar">AI</div>
      <div class="message-content" style="color:red"></div>
    `;
    message.querySelector(".message-content").textContent = `Error: ${text}`;
    chatMessages.appendChild(message); // Append the error message to the chat
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
  }
});
