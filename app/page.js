"use client";
import { TextField, Button } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi, I'm Headstarter. How can I help you today?" },
  ]);

  const sendMessage = async () => {

    setMessage('')
    setMessages((messages) => [...messages, { role: "user", content: message}, { role: "assistant", content: "" }]);
    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: 'user', content: message}]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
    
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [...otherMessages, { ...lastMessage, content: lastMessage.content + text }];
        });
    
        return reader.read().then(processText);
      });
    });
  }
    

  // const data = await response.json();
  // setMessages((messages) => [...messages, { role: "assistant", content: data.message }]);

  const [message, setMessage] = useState("");

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      spacing={3}
    >
      <Stack direction="column" width="500px" height="700px" border={1} borderRadius={2} p={2}>
        <Stack direction="column" spacing={2} flexGrow={1} overflow="auto">
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
            >
              <Box
                bgcolor={message.role === "assistant" ? "primary.main" : "secondary.main"}
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField label="Message" fullWidth color="secondary" value={message} onChange={(e) => setMessage(e.target.value)}/>
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
