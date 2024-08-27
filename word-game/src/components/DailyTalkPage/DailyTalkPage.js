import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import DailyTalkIntroductionModal from '../DailyTalkIntroductionModal/DailyTalkIntroductionModal';
import './DailyTalkPage.css';

const DailyTalkPage = () => {
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState([]);
  const [alexVoice, setAlexVoice] = useState(null);
  const [jamieVoice, setJamieVoice] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [activeWord, setActiveWord] = useState({ lineIndex: null, wordIndex: null });

  const person1 = "Aiden";
  const person2 = "Kaylee";

  useEffect(() => {
    const loadVoices = () => {
      const synth = window.speechSynthesis;
      const availableVoices = synth.getVoices();

      const alexSelectedVoice = availableVoices.find(voice => voice.name.includes('Alex')) || availableVoices[0];
      const jamieSelectedVoice = availableVoices.find(voice => voice.name.includes('Female') || voice.name.includes('Samantha')) || availableVoices[1];

      setVoices(availableVoices);
      setAlexVoice(alexSelectedVoice);
      setJamieVoice(jamieSelectedVoice);
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }, []);

  const sanitizeText = (text) => {
    return text.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, "").replace(/\s{2,}/g, " ");
  };

  const generateConversation = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://apiwordgame.aidenkiettran.com/generate-daily-talk');
      let conversationText = response.data.conversation;

      conversationText = conversationText.replace(/Person 1:/g, `${person1}:`);
      conversationText = conversationText.replace(/Person 2:/g, `${person2}:`);

      const lines = conversationText.split('\n').filter(line => line.trim() !== '');
      setConversation(lines);
      setShowModal(false);
    } catch (error) {
      console.error('Error generating conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayConversation = () => {
    const synth = window.speechSynthesis;
    synth.cancel(); // Cancel any previous speech synthesis in progress

    conversation.forEach((line, lineIndex) => {
      const speaker = line.startsWith(`${person1}:`) ? person1 : person2;
      const cleanText = sanitizeText(line.replace(`${speaker}:`, '').trim());
      const words = cleanText.split(/\s+/); // Split words by spaces

      let utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.voice = speaker === person1 ? alexVoice : jamieVoice;

      // Manually iterate through words and update active word based on timing
      let wordIndex = 0;
      const wordDurations = 300; // Estimated duration per word in ms (adjust as necessary)

      utterance.onstart = () => {
        // Loop through words and highlight them at intervals
        const interval = setInterval(() => {
          if (wordIndex < words.length) {
            setActiveWord({ lineIndex, wordIndex });
            wordIndex++;
          } else {
            clearInterval(interval); // Clear interval when all words are highlighted
          }
        }, wordDurations);
      };

      utterance.onend = () => {
        setActiveWord({ lineIndex: null, wordIndex: null });
      };

      synth.speak(utterance);
    });
  };

  return (
    <div className="wrapper">
      <Navbar />

      {showModal && (
        <DailyTalkIntroductionModal onClose={generateConversation} />
      )}

      <div className="main-content">
        <div className="left-column">
          <h1 className="daily-talk-title">Daily Talk</h1>
        </div>

        <div className="right-column">
          <div className="conversation-container">
            {conversation.map((line, lineIndex) => (
              <div
                key={lineIndex}
                className={line.startsWith(`${person1}:`)
                  ? 'chat-bubble aiden-bubble'
                  : 'chat-bubble kaylee-bubble'}
              >
                <p className="bubble-text">
                  {line.replace(`${line.startsWith(`${person1}:`) ? person1 : person2}:`, '').trim().split(/\s+/).map((word, wordIndex) => (
                    <span
                      key={wordIndex}
                      className={
                        activeWord.lineIndex === lineIndex && activeWord.wordIndex === wordIndex
                          ? 'active-word'
                          : ''
                      }
                    >
                      {word}{' '}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {conversation.length > 0 && (
          <div className="icon-buttons">
            <button className="circle-play-button" onClick={handlePlayConversation}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="40px" height="40px">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <button className="circle-next-button" onClick={generateConversation}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="40px" height="40px">
                <path d="M10 6l6 6-6 6-1.42-1.42L13.16 12 8.58 7.42z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DailyTalkPage;
