import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatState } from '../types';
import MessageList from './MessageList';
import InputArea from './InputArea';
import SettingsPanel from './SettingsPanel';
import SystemPrompt from './SystemPrompt';
import { Settings, Download } from 'lucide-react';

const ChatInterface: React.FC = () => {
  // ... (previous state declarations remain the same)

  const verifyApiKey = useCallback(async (apiKey: string) => {
    try {
      const response = await axios.get(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );
      console.log('API Key verification response:', response);
      setApiKeyStatus('valid');
      setAvailableModels(response.data.models.map(model => model.name));
      return true;
    } catch (error) {
      console.error('Error verifying API key:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data || 'No response data');
      } else {
        console.error('Non-Axios error:', error);
      }
      setApiKeyStatus('invalid');
      return false;
    }
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (apiKeyStatus !== 'valid') {
      alert('Please set a valid API key in the settings first.');
      setShowSettings(true);
      return;
    }

    const newMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: Date.now(),
      wordCount: content.split(/\s+/).length,
      tokenCount: await estimateTokens(content),
    };

    setChatState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, newMessage],
    }));

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const startTime = Date.now();
      console.log('Sending request to Gemini API...');
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${chatState.modelName}:generateContent?key=${chatState.apiKey}`,
        {
          contents: [
            { role: 'user', parts: [{ text: chatState.systemPrompt }] },
            ...chatState.messages.map((msg) => ({ role: msg.role === 'model' ? 'model' : 'user', parts: [{ text: msg.content }] })),
            { role: 'user', parts: [{ text: content }] },
          ],
        },
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      const endTime = Date.now();

      console.log('Gemini API response:', response.data);

      if (response.data && response.data.candidates && response.data.candidates[0]) {
        const assistantContent = response.data.candidates[0].content.parts[0].text;
        const assistantMessage: Message = {
          id: uuidv4(),
          role: 'model',
          content: assistantContent,
          timestamp: Date.now(),
          latency: endTime - startTime,
          tokenCount: await estimateTokens(assistantContent),
          wordCount: assistantContent.split(/\s+/).length,
          modelName: chatState.modelName,
        };

        setChatState((prevState) => ({
          ...prevState,
          messages: [...prevState.messages, assistantMessage],
        }));
      } else {
        throw new Error('Unexpected response format from Gemini API');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data || 'No response data');
      } else {
        console.error('Non-Axios error:', error);
      }
      alert(`An error occurred while sending the message: ${error.message}`);
    }
  }, [apiKeyStatus, chatState.apiKey, chatState.systemPrompt, chatState.messages, chatState.modelName]);

  // ... (rest of the component remains the same)

  return (
    // ... (JSX remains the same)
  );
};

export default ChatInterface;