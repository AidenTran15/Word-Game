import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DefinitionModal.css';

const DefinitionModal = ({ show, onClose, selectedWord, language, toggleLanguage }) => {
  const [definition, setDefinition] = useState('');
  const [vietnameseTranslation, setVietnameseTranslation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDefinitionAndTranslation = async () => {
      if (selectedWord && show) {
        setLoading(true);

        try {
          // Fetch English definition
          const definitionResponse = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`);
          const englishDefinition = definitionResponse.data[0].meanings[0].definitions[0].definition;
          setDefinition(englishDefinition);

          // Fetch Vietnamese translation if language is 'vi'
          if (language === 'vi') {
            const translationResponse = await axios.post('https://apiwordgame.aidenkiettran.com/translate-word', { word: selectedWord });
            setVietnameseTranslation(translationResponse.data.vietnameseTranslation);
          }
        } catch (error) {
          console.error('Error fetching definition or translation:', error);
          setDefinition('No definition found.');
          setVietnameseTranslation('No Vietnamese translation found.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDefinitionAndTranslation();
  }, [selectedWord, show, language]);

  if (!show) return null;

  const handleSpeak = () => {
    if (selectedWord) {
      const utterance = new SpeechSynthesisUtterance(selectedWord);
      utterance.lang = language === 'en' ? 'en-US' : 'vi-VN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="modal-overlay-dm">
      <div className="modal-content-dm">
        <h2>Word Definition</h2>
        <div className="dm-word-section">
  <span className="dm-word-display">{selectedWord || 'No word selected'}</span>
  {selectedWord && (
    <button className="dm-speak-button" onClick={handleSpeak}>
      <i className="fas fa-volume-up"></i>
    </button>
  )}
</div>



        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h4>{language === 'en' ? definition : vietnameseTranslation}</h4>
          </>
        )}

        <button onClick={toggleLanguage}>
          {language === 'en' ? 'View in Vietnamese' : 'View in English'}
        </button>
        <button onClick={onClose} style={{ marginTop: '20px' }}>Close</button>
      </div>
    </div>
  );
};

export default DefinitionModal;
