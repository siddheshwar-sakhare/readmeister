import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:1001";

const RepositoryAnalyzer = () => {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [loadingStep, setLoadingStep] = useState(null); // 'ingest' | 'analyze' | null
  const [error, setError] = useState(null);
  const [isIngesting, setIsIngesting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);
  
  // Chatbot State
  const [chatHistory, setChatHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isChatting, setIsChatting] = useState(false);

  useEffect(() => {
    // Fetch user's GitHub repositories on mount
    const fetchRepos = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/github/repos`, {
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setRepos(data);
          if (data.length > 0) setSelectedRepo(data[0].full_name);
        }
      } catch (err) {
        console.error("Failed to load repositories:", err);
      }
    };
    fetchRepos();
  }, []);

  const handleIngestAndAnalyze = async () => {
    if (!selectedRepo) return;

    setIsIngesting(true);
    setLoadingStep("ingest");
    setIngestSuccess(false);
    setError(null);
    setAnalysisResult("");
    setChatHistory([]); // Clear chat

    try {
      const res = await fetch(`${BACKEND_URL}/api/analyze/ingest`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoFullName: selectedRepo }),
      });

      if (!res.ok) {
        throw new Error("Failed to ingest repository");
      }

      setIngestSuccess(true);
      // Auto-trigger analysis once ingested
      await handleAnalyze();

    } catch (err) {
      console.error(err);
      setError("Failed to ingest repository. Please check the backend and your GitHub connection.");
      setLoadingStep(null);
      setIsIngesting(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setLoadingStep("analyze");
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/analyze/generate-overview`, {
        credentials: "include"
      });
      if (!res.ok) {
        throw new Error("Failed to analyze repository");
      }
      const data = await res.text();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Ensure Qdrant and your AI models are running.");
    } finally {
      setLoadingStep(null);
      setIsIngesting(false); // Reset ingesting state after analysis is done
      setIsAnalyzing(false);
      setChatHistory([]); // reset chat context on new analysis
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!currentQuestion.trim() || isChatting) return;

    const query = currentQuestion.trim();
    const newHistory = [...chatHistory, { role: "user", text: query }];
    
    setChatHistory(newHistory);
    setCurrentQuestion("");
    setIsChatting(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/analyze/chat`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });

      if (!res.ok) throw new Error("Chat request failed");
      const answer = await res.text();
      
      setChatHistory([...newHistory, { role: "ai", text: answer }]);
    } catch (err) {
      console.error(err);
      setChatHistory([...newHistory, { role: "error", text: "Failed to get an answer. Ensure the server is running." }]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full h-full text-gray-800">

      {/* Ingestion Section */}
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-5xl mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Repository Analyzer</h2>
        <p className="text-gray-600 mb-4">
          Select a GitHub repository to analyze its codebase.
        </p>

        <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Select GitHub Repository
            </label>
            <select
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-inner"
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              disabled={isIngesting || isAnalyzing}
            >
              <option value="" disabled>Select a repository to analyze...</option>
              {repos.map(repo => (
                <option key={repo.id} value={repo.full_name}>
                  {repo.full_name}
                </option>
              ))}
            </select>
            <p className="text-gray-500 text-sm mt-2">
              The AI will directly download this repository securely from GitHub, embed its codebase, and analyze its architecture.
            </p>
          </div>

        <div className="mt-4 flex gap-4">
          <button
            onClick={handleIngestAndAnalyze}
            disabled={isIngesting || isAnalyzing || !selectedRepo}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 font-semibold transition disabled:opacity-50"
          >
            {loadingStep === "ingest" ? "Ingesting..." : "Ingest & Analyze"}
          </button>
          <button
            onClick={handleAnalyze}
            disabled={loadingStep !== null}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl hover:bg-gray-300 font-semibold transition disabled:opacity-50"
          >
           {loadingStep === "analyze" ? "Analyzing..." : "Analyze Saved Context"}
          </button>
        </div>
        
        {error && <p className="text-red-500 mt-4 font-semibold">{error}</p>}
      </div>

      {/* Analysis Output Section */}
      {(analysisResult || loadingStep === "analyze") && (
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-5xl">
          {loadingStep === "analyze" ? (
             <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <span className="ml-4 text-purple-600 font-semibold text-lg">AI is generating deep analysis...</span>
             </div>
          ) : (
             <>
               <div className="prose prose-purple max-w-none border-b border-gray-200 pb-8 mb-8">
                  <ReactMarkdown>{analysisResult}</ReactMarkdown>
               </div>

               {/* CHATBOT UI */}
               <div className="flex flex-col h-96">
                 <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Talk with the Repository
                 </h3>
                 
                 <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded-xl p-4 border border-gray-200 flex flex-col gap-4">
                   {chatHistory.length === 0 && (
                     <div className="text-gray-400 text-center mt-10">
                       Ask a specific question about the code, architecture, or logic!
                     </div>
                   )}
                   
                   {chatHistory.map((msg, idx) => (
                     <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : msg.role === 'error' ? 'bg-red-100 text-red-700' : 'bg-white border border-gray-300 text-gray-800 rounded-bl-none shadow-sm'}`}>
                         {msg.role === 'ai' ? (
                           <div className="prose prose-sm prose-purple max-w-none">
                             <ReactMarkdown>{msg.text}</ReactMarkdown>
                           </div>
                         ) : (
                           msg.text
                         )}
                       </div>
                     </div>
                   ))}
                   
                   {isChatting && (
                     <div className="flex justify-start">
                       <div className="bg-white border border-gray-300 text-gray-500 rounded-2xl rounded-bl-none p-3 shadow-sm flex items-center gap-2">
                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                       </div>
                     </div>
                   )}
                 </div>

                 <form onSubmit={handleAskQuestion} className="flex gap-2">
                   <input
                     type="text"
                     value={currentQuestion}
                     onChange={(e) => setCurrentQuestion(e.target.value)}
                     placeholder="How does the authentication flow work?"
                     disabled={isChatting}
                     className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                   />
                   <button
                     type="submit"
                     disabled={!currentQuestion.trim() || isChatting}
                     className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 font-semibold transition disabled:opacity-50 flex items-center gap-2 shadow-sm"
                   >
                     Send
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                     </svg>
                   </button>
                 </form>
               </div>
             </>
          )}
        </div>
      )}
      
    </div>
  );
}

export default RepositoryAnalyzer;
