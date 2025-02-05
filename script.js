//api key = AIzaSyC_kq6N82UdZX0YWTfDamPO32_GCvieR7g
// https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$AIzaSyC_kq6N82UdZX0YWTfDamPO32_GCvieR7g

document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatMessages = document.getElementById("chatMessages");
    const sendButton = document.getElementById("sendButton");
  
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
      const apiKey = "AIzaSyC_kq6N82UdZX0YWTfDamPO32_GCvieR7g"; // Replace with your actual API key or use environment variables
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
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
        throw new Error(`Failed to generate response: ${response.statusText}`);
      }
  
      const data = await response.json();
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
        throw new Error("Invalid response format from the API");
      }
  
      return data.candidates[0].content.parts[0].text;
    }
  
    // Function to add a message to the chat
    function addMessage(text, isUser) {
      const message = document.createElement("div");
      message.className = `message ${isUser ? "user-message" : ""}`;
      message.innerHTML = `
        <div class="avatar ${isUser ? "user-avatar" : ""}">
          ${isUser ? "U" : "AI"}
        </div>
        <div class='message-content'>${text}</div>
      `;
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
          <div class='dot'></div>
          <div class='dot'></div>
          <div class='dot'></div>
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
        <div class="message-content" style="color:red">
          Error: ${text}
        </div>
      `;
      chatMessages.appendChild(message); // Append the error message to the chat
      chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }
  });