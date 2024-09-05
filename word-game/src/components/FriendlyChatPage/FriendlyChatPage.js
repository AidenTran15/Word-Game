import React, { useState, useRef } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './FriendlyChatPage.css';

AWS.config.update({
  region: process.env.REACT_APP_AWS_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const polly = new AWS.Polly();

const FriendlyChatPage = () => {
  const [userInput, setUserInput] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false); // Track listening state
  const [conversation, setConversation] = useState([]);
  const [aiMode, setAiMode] = useState('Chat'); // Default mode is 'Chat'
  const [showIntroModal, setShowIntroModal] = useState(false); // State to manage the modal visibility
  const [questionCount, setQuestionCount] = useState(0); // Track number of questions asked
  const [showFeedbackModal, setShowFeedbackModal] = useState(false); // State to manage feedback modal
  const [feedback, setFeedback] = useState(''); // Store feedback
  const recognitionRef = useRef(null);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setUserInput(speechResult);

        // Hide the waveform and show the input field again when speech ends
        setIsSpeaking(false);
      };

      recognitionRef.current.onend = () => {
        setIsSpeaking(false);
        setIsListening(false); // Set listening to false when recognition ends
      };
    }

    if (!isListening) {
      // Start listening
      setIsSpeaking(true);
      setIsListening(true); // Update state to indicate recognition is active
      recognitionRef.current.start();
    } else {
      // Stop listening
      recognitionRef.current.stop();
      setIsSpeaking(false);
      setIsListening(false); // Update state to indicate recognition has stopped
    }
  };

  const handleModeChange = (e) => {
    setAiMode(e.target.value);
    if (e.target.value === 'AI-Interview') {
      setShowIntroModal(true); // Show the modal when AI-Interview mode is selected
    }
  };

  const startInterview = async () => {
    setShowIntroModal(false); // Close the modal
    setQuestionCount(0); // Reset question count at the start of a new interview

    try {
      const response = await axios.post('https://apiwordgame.aidenkiettran.com/start-interview');
      const firstQuestion = response.data.question;
      setConversation([{ role: 'ai', content: firstQuestion }]);
      speakText(firstQuestion);
      setQuestionCount(1);
    } catch (error) {
      console.error('Error starting interview:', error);
    }
  };

  const handleSubmit = async () => {
    if (userInput.trim() === '') return;
  
    setConversation((prev) => [...prev, { role: 'user', content: userInput }]);
  
    if (aiMode === 'AI-Interview') {
      try {
        const response = await axios.post('https://apiwordgame.aidenkiettran.com/submit-interview-answer', { answer: userInput });
        const aiContent = response.data.question || response.data.feedback;
  
        if (response.data.feedback) {
          setFeedback(response.data.feedback);
          setShowFeedbackModal(true); // Show feedback modal after all questions
          speakText(response.data.feedback); // Speak the feedback
        } else {
          // Handle next question
          setConversation((prev) => [...prev, { role: 'ai', content: aiContent }]);
          speakText(aiContent);
  
          // Increment question count correctly
          setQuestionCount((prevCount) => {
            const newCount = prevCount + 1;
  
            // Check if this is the 5th question
            if (newCount >= 6) {
              // Generate and show feedback after 5 questions
              setShowFeedbackModal(true);
            }
  
            return newCount;
          });
        }
      } catch (error) {
        console.error('Error in interview mode:', error);
      }
    } else {
      // Normal chat mode
      try {
        const response = await axios.post('https://apiwordgame.aidenkiettran.com/converse', { userInput });
        const aiResponse = response.data.response;
  
        setConversation((prev) => [...prev, { role: 'ai', content: aiResponse }]);
  
        const pollyParams = {
          OutputFormat: 'mp3',
          Text: aiResponse,
          VoiceId: 'Joanna',
        };
  
        polly.synthesizeSpeech(pollyParams, (err, data) => {
          if (err) {
            console.error('Error synthesizing speech:', err);
          } else if (data.AudioStream) {
            const uInt8Array = new Uint8Array(data.AudioStream);
            const audioBlob = new Blob([uInt8Array.buffer], { type: 'audio/mp3' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
          }
        });
  
        setUserInput(''); // Clear input field after submission
      } catch (error) {
        console.error('Error communicating with AI:', error);
      }
    }
  
    setUserInput(''); // Clear input field after submission
  };
  

  const speakText = (text) => {
    const pollyParams = {
      OutputFormat: 'mp3',
      Text: text,
      VoiceId: 'Joanna',
    };

    polly.synthesizeSpeech(pollyParams, (err, data) => {
      if (err) {
        console.error('Error synthesizing speech:', err);
      } else if (data.AudioStream) {
        const uInt8Array = new Uint8Array(data.AudioStream);
        const audioBlob = new Blob([uInt8Array.buffer], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      }
    });
  };

  return (
    <div className="page-container">
      <Navbar />
      <select className="ai-mode-dropdown" onChange={handleModeChange} value={aiMode}>
        <option value="Chat">Chat</option>
        <option value="AI-Interview">AI-Interview</option>
      </select>
      <div className="content-wrap">
        <div className="chat-container">
          <div className="input-section">
            <div className="input-wrapper">
              {!isSpeaking ? (
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type message or use the mic"
                  className="user-input"
                />
              ) : (
                <div className="waveform">
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              )}
            </div>
            <button onClick={handleSubmit} className="send-button"></button>
          </div>
          <div className="conversation-section">
            {conversation.map((entry, index) => (
              <div key={index} className={entry.role}>
                <strong>{entry.role === 'user' ? 'You' : 'AI'}:</strong> {entry.content}
              </div>
            ))}
          </div>
        </div>
        <button 
          onClick={toggleSpeechRecognition} 
          className="speak-button">
          🎤 
        </button>
      </div>

      {showIntroModal && (
        <div className="intro-modal">
          <div className="modal-content">
            <h2>AI Interview Mode</h2>
            <p>You will be asked a few questions regarding an interview. After all the questions, AI will give you a score and provide feedback on what you need to improve.</p>
            <button onClick={startInterview} className="understand-button">I Understand</button>
          </div>
        </div>
      )}

      {showFeedbackModal && (
        <div className="feedback-modal">
          <div className="modal-content">
            <h2>Interview Feedback</h2>
            <p>{feedback}</p>
            <button onClick={() => setShowFeedbackModal(false)} className="close-button">Close</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default FriendlyChatPage;
