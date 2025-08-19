import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceCommandsProps {
  onCommand: (command: string) => void;
  isEnabled: boolean;
}

export const VoiceCommands: React.FC<VoiceCommandsProps> = ({ onCommand, isEnabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!isEnabled) return;

    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);

        if (event.results[current].isFinal) {
          processCommand(transcript);
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        setTranscript('');
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isEnabled]);

  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Process voice commands
    if (lowerCommand.includes('generate report')) {
      onCommand('generate_report');
      speak('Generating new report');
    } else if (lowerCommand.includes('show dashboard')) {
      onCommand('show_dashboard');
      speak('Showing dashboard');
    } else if (lowerCommand.includes('market overview')) {
      onCommand('show_market');
      speak('Showing market overview');
    } else if (lowerCommand.includes('settings')) {
      onCommand('show_settings');
      speak('Opening settings');
    } else if (lowerCommand.includes('refresh data')) {
      onCommand('refresh_data');
      speak('Refreshing market data');
    } else {
      speak('Command not recognized. Try saying generate report, show dashboard, or market overview.');
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-full shadow-lg border border-slate-200 p-3">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`p-3 rounded-full transition-colors ${
            isListening 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
      </div>
      
      {isListening && (
        <div className="absolute bottom-16 right-0 bg-slate-900 text-white p-3 rounded-lg shadow-lg min-w-48">
          <div className="flex items-center space-x-2 mb-2">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm font-medium">Listening...</span>
          </div>
          {transcript && (
            <p className="text-sm text-slate-300">{transcript}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}