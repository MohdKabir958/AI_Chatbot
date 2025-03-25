import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out" });
  }, []);

  const handleSend = async () => {
    if (!message) return;

    setLoading(true);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        }),
      });

      const data = await res.json();
      if (data.choices && data.choices.length > 0) {
        setResponse(data.choices[0].message.content);
      } else {
        setResponse("No valid response received.");
      }
    } catch (error) {
      setResponse("Error fetching response. Please try again.");
      console.error(error);
    }
    setLoading(false);
  };

  // Function to detect if response contains code
  const isCodeResponse = (text) => text.includes("```");

  return (
    <>
        <h2 className="text-center w-full bg-gray-900 text-3xl p-4 text-orange-500 ">AI CHATBOT BY KABIR</h2>
    <div className="h-screen w-full bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="flex w-full max-w-6xl h-full space-x-6">

        
        {/* User Input (30%) */}
        <div className="w-[30%] bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col" data-aos="fade-right">
          <h2 className="text-xl font-bold mb-4">Your Message</h2>
          <textarea
            className="w-full h-40 p-3 bg-gray-700 text-white rounded-lg focus:outline-none resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-black py-2 rounded-lg transition cursor-pointer"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Generating..." : "Send"}
          </button>
        </div>

        {/* AI Response (70%) */}
        <div className="w-[70%] p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col" data-aos="fade-left">
          <h2 className="text-xl font-bold mb-4">AI Response :-</h2>
          <div className="h-full overflow-auto bg-gray-700 p-4 rounded-lg">
            {response ? (
              isCodeResponse(response) ? (
                <SyntaxHighlighter language="javascript" style={atomDark} className="rounded-lg">
                  {response.replace(/```[a-z]*\n?/g, "")} {/* Remove markdown code blocks */}
                </SyntaxHighlighter>
              ) : (
                <p>{response}</p>
              )
            ) : (
              <p className="text-gray-400">Waiting for response...</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;



// function App() {
//   const [message, setMessage] = useState("");
//   const [response, setResponse] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     AOS.init({ duration: 800, easing: "ease-in-out" });
//   }, []);

//   const handleSend = async () => {
//     if (!message) return;

//     setLoading(true);
//     try {
//       const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: "openai/gpt-4o", // Using GPT-4o for better responses
//           messages: [{ role: "user", content: message }],
//         }),
//       });

//       const data = await res.json();
//       if (data.choices && data.choices.length > 0) {
//         setResponse(data.choices[0].message.content);
//       } else {
//         setResponse("No valid response received.");
//       }
//     } catch (error) {
//       setResponse("Error fetching response. Please try again.");
//       console.error(error);
//     }
//     setLoading(false);
//   };

//   // Function to detect code blocks and extract language
//   const detectLanguage = (text) => {
//     const match = text.match(/```(\w+)/);
//     return match ? match[1] : "plaintext"; // Default to plaintext if no language is found
//   };

//   // Function to check if response contains code
//   const isCodeResponse = (text) => text.includes("```");

//   return (
//     <div className="h-screen w-full bg-gray-900 text-white flex items-center justify-center p-6">
//       <div className="flex w-full max-w-6xl h-full space-x-6">
        
//         {/* User Input (30%) */}
//         <div className="w-[30%] bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col" data-aos="fade-right">
//           <h2 className="text-xl font-bold mb-4">Your Message</h2>
//           <textarea
//             className="w-full h-40 p-3 bg-gray-700 text-white rounded-lg focus:outline-none resize-none"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Ask something..."
//           />
//           <button
//             className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
//             onClick={handleSend}
//             disabled={loading}
//           >
//             {loading ? "Generating..." : "Send"}
//           </button>
//         </div>

//         {/* AI Response (70%) */}
//         <div className="w-[70%] p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col" data-aos="fade-left">
//           <h2 className="text-xl font-bold mb-4">AI Response</h2>
//           <div className="h-full overflow-auto bg-gray-700 p-4 rounded-lg">
//             {response ? (
//               isCodeResponse(response) ? (
//                 <SyntaxHighlighter language={detectLanguage(response)} style={atomDark} className="rounded-lg">
//                   {response.replace(/```[a-z]*\n?/g, "").trim()} {/* Removes markdown ```python */}
//                 </SyntaxHighlighter>
//               ) : (
//                 <p>{response}</p>
//               )
//             ) : (
//               <p className="text-gray-400">Waiting for response...</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

