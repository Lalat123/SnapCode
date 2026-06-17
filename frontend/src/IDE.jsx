import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Loader2, Code2, Download, Settings, RotateCcw, X, Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/submissions';

function IDE() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const baseDefaultCodes = {
    python: '# cook your dish here\n',
    cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code goes here\n    return 0;\n}\n',
    java: 'import java.util.*;\nimport java.lang.*;\nimport java.io.*;\n\nclass Main {\n    public static void main(String[] args) throws java.lang.Exception {\n        // your code goes here\n    }\n}\n',
    javascript: '// your code goes here\n'
  };

  const [defaultCodes, setDefaultCodes] = useState(baseDefaultCodes);
  const [codes, setCodes] = useState(baseDefaultCodes);

  // Fetch cloud templates
  React.useEffect(() => {
    if (user?.email) {
      axios.get(`http://localhost:5000/api/auth/templates?email=${user.email}`)
        .then(res => {
          if (res.data.templates) {
            setDefaultCodes(res.data.templates);
            setCodes(res.data.templates);
          }
        })
        .catch(err => console.error('Failed to fetch templates', err));
    }
  }, [user]);
  const [language, setLanguage] = useState('python');
  const [customInput, setCustomInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState('vs-dark');
  const [tabSize, setTabSize] = useState(4);
  const [fontSize, setFontSize] = useState(16);
  const [softWrap, setSoftWrap] = useState(true);
  const [autocomplete, setAutocomplete] = useState(true);

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('dracula', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { background: '282a36' },
        { token: 'comment', foreground: '6272a4' },
        { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'number', foreground: 'bd93f9' },
      ],
      colors: {
        'editor.background': '#282a36',
        'editor.foreground': '#f8f8f2',
        'editorCursor.foreground': '#f8f8f0',
        'editor.selectionBackground': '#44475a',
        'editor.lineHighlightBackground': '#44475a',
      }
    });

    monaco.editor.defineTheme('monokai', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { background: '272822' },
        { token: 'comment', foreground: '75715e' },
        { token: 'keyword', foreground: 'f92672', fontStyle: 'bold' },
        { token: 'string', foreground: 'e6db74' },
        { token: 'number', foreground: 'ae81ff' },
      ],
      colors: {
        'editor.background': '#272822',
        'editor.foreground': '#f8f8f2',
        'editorCursor.foreground': '#f8f8f0',
        'editor.selectionBackground': '#49483e',
        'editor.lineHighlightBackground': '#3e3d32',
      }
    });
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleResetCode = () => {
    setCodes(prev => ({
      ...prev,
      [language]: defaultCodes[language]
    }));
  };

  const handleSaveTemplate = async () => {
    const newDefaults = {
      ...defaultCodes,
      [language]: codes[language]
    };
    setDefaultCodes(newDefaults);
    
    try {
      await axios.post('http://localhost:5000/api/auth/templates', {
        email: user.email,
        templates: newDefaults
      });
      alert('Template successfully saved to the cloud!');
    } catch (err) {
      console.error(err);
      alert('Error saving template to cloud');
    }
  };

  const pollSubmission = async (jobId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/${jobId}`);
      if (res.data.status === 'Completed' || res.data.status === 'Failed') {
        setSubmissionResult(res.data.result || { status: 'Failed', output: res.data.error });
        setIsSubmitting(false);
      } else {
        setTimeout(() => pollSubmission(jobId), 1000);
      }
    } catch (err) {
      console.error(err);
      setSubmissionResult({ status: 'Failed', output: 'Network Error: Could not fetch results from backend.' });
      setIsSubmitting(false);
    }
  };

  const handleRun = async () => {
    setIsSubmitting(true);
    setSubmissionResult(null);
    try {
      const res = await axios.post(API_BASE_URL, {
        language,
        code: codes[language],
        customInput
      });
      pollSubmission(res.data.jobId);
    } catch (err) {
      console.error(err);
      setSubmissionResult({ status: 'Failed', output: 'Network Error: Could not connect to backend server. Make sure the backend is running!' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="SnapCode Logo" style={{ height: 32, width: 'auto' }} />
          <span style={{ fontSize: '1.2rem', marginLeft: 12, fontWeight: 700, letterSpacing: '0.5px' }}>SnapCode</span>
        </div>
        <button 
          onClick={() => {
            logout();
            navigate('/');
          }}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, padding: '8px 12px', borderRadius: '6px', transition: 'background-color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <LogOut size={18} /> Logout
        </button>
      </header>
      
      <main className="workspace">
        {/* Left Panel: Code Editor */}
        <section className="editor-panel">
          <div className="panel-header">
            <select value={language} onChange={handleLanguageChange}>
              <option value="python">Python3</option>
              <option value="cpp">C++ (GCC)</option>
              <option value="java">Java</option>
              <option value="javascript">JavaScript (Node)</option>
            </select>
            <div style={{ display: 'flex', gap: 12 }}>
              <Download size={18} color="var(--primary)" style={{ cursor: 'pointer' }} />
              <Settings 
                size={18} 
                color="var(--primary)" 
                style={{ cursor: 'pointer' }} 
                onClick={() => setIsSettingsOpen(true)}
              />
            </div>
          </div>
          
          <div style={{ flex: 1, minHeight: 0 }}>
            <Editor
              beforeMount={handleEditorWillMount}
              height="100%"
              theme={theme}
              language={language}
              value={codes[language]}
              onChange={(val) => setCodes(prev => ({ ...prev, [language]: val }))}
              options={{
                minimap: { enabled: false },
                fontSize: fontSize,
                tabSize: parseInt(tabSize),
                wordWrap: softWrap ? 'on' : 'off',
                quickSuggestions: autocomplete,
                suggestOnTriggerCharacters: autocomplete,
                fontFamily: 'JetBrains Mono, monospace',
                padding: { top: 16 }
              }}
            />
          </div>
        </section>

        {/* Right Panel: Input / Output */}
        <section className="right-panel">
          <div className="controls-row">
            <button 
              className="btn btn-primary" 
              onClick={handleRun}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="spinner" size={16} /> : <Play size={16} fill="white" />}
              {isSubmitting ? 'Running...' : 'Run'}
            </button>
            <button className="btn btn-secondary" onClick={handleResetCode}>
              <RotateCcw size={16} /> Reset Code
            </button>
          </div>

          <div className="input-section">
            <textarea 
              className="custom-textarea" 
              placeholder="Enter Input here"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            ></textarea>
            <label style={{ marginTop: 8, fontSize: '0.85rem' }}>If your code takes input, add it in the above box before running.</label>
          </div>

          <div className="output-section">
            <div className="output-header">Output</div>
            
            {submissionResult ? (
              <>
                <div className={`status-box ${submissionResult.status.includes('Error') || submissionResult.status === 'Failed' ? 'error' : ''}`}>
                  Status : {submissionResult.status}
                </div>
                
                {submissionResult.status !== 'Failed' && submissionResult.status !== 'Compilation Error' && (
                  <div className="metrics-row">
                    <div className="metric">
                      <span className="metric-label">Time:</span>
                      <span>{submissionResult.time} secs</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Memory:</span>
                      <span>{submissionResult.memory}</span>
                    </div>
                  </div>
                )}

                <div style={{ fontSize: '0.9rem', marginBottom: 8, color: 'var(--text-muted)' }}>Your Output</div>
                <div className="output-box">
                  {submissionResult.output}
                </div>
              </>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Run your code to see the output here.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editor Settings</h2>
              <X size={20} className="modal-close" onClick={() => setIsSettingsOpen(false)} />
            </div>
            <div className="modal-body">
              
              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-title">Theme</div>
                  <div className="setting-desc">Tired of the white background? Try different styles and syntax highlighting.</div>
                </div>
                <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ padding: '6px 12px' }}>
                  <option value="vs-dark">Dark (VS Code)</option>
                  <option value="dracula">Dracula</option>
                  <option value="monokai">Monokai</option>
                  <option value="light">Light</option>
                  <option value="hc-black">High Contrast Dark</option>
                </select>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-title">Tab Size</div>
                  <div className="setting-desc">Choose the width of a tab character.</div>
                </div>
                <select value={tabSize} onChange={(e) => setTabSize(e.target.value)} style={{ padding: '6px 12px' }}>
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                  <option value="8">8 spaces</option>
                </select>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-title">Font Size</div>
                  <div className="setting-desc">Choose your preferred font size for the code editor.</div>
                </div>
                <div className="number-input-group">
                  <button onClick={() => setFontSize(Math.max(10, fontSize - 1))}>-</button>
                  <span>{fontSize}</span>
                  <button onClick={() => setFontSize(Math.min(32, fontSize + 1))}>+</button>
                </div>
              </div>

              <div className="setting-row">
                <div className="setting-info">
                  <div className="setting-title">Save Template</div>
                  <div className="setting-desc">Save your current code as a template for future use.</div>
                </div>
                <button className="btn btn-secondary" onClick={handleSaveTemplate} style={{ gap: '6px' }}>
                  <Save size={14} /> Save Template
                </button>
              </div>

              <div className="checkbox-row">
                <label className="checkbox-label">
                  Soft Wrap
                  <input 
                    type="checkbox" 
                    checked={softWrap} 
                    onChange={(e) => setSoftWrap(e.target.checked)} 
                  />
                </label>
                <label className="checkbox-label">
                  Autocomplete
                  <input 
                    type="checkbox" 
                    checked={autocomplete} 
                    onChange={(e) => setAutocomplete(e.target.checked)} 
                  />
                </label>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IDE;
