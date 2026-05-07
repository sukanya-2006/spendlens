// "use client";

// import { useState } from "react";
// import SpendForm from "./components/SpendForm";
// import { FormData } from "./types";

// export default function Home() {
//   const [submitted, setSubmitted] = useState(false);
//   const [formData, setFormData] = useState<FormData | null>(null);

//   const handleSubmit = (data: FormData) => {
//     setFormData(data);
//     setSubmitted(true);
//   };

//   if (submitted && formData) {
//     return (
//       <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-orange-400 mb-2">Audit received!</h2>
//           <p className="text-gray-400">Results page coming soon...</p>
//         </div>
//       </div>
//     );
//   }

//   return <SpendForm onSubmit={handleSubmit} />;
// }




"use client";

import { useState } from "react";
import SpendForm from "./components/SpendForm";
import AuditResults from "./components/AuditResults";
import { FormData } from "./types";
import { runAudit, AuditResult } from "./lib/auditEngine";

export default function Home() {
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleSubmit = (data: FormData) => {
    const auditResult = runAudit(data);
    setResult(auditResult);
  };

  const handleReset = () => {
    setResult(null);
  };

  if (result) {
    return <AuditResults result={result} onReset={handleReset} />;
  }

  return <SpendForm onSubmit={handleSubmit} />;
}