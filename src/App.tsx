import { useState } from 'react';
import { Background } from './components/Background';
import { ProposalCard } from './components/ProposalCard';
import { SuccessView } from './components/SuccessView';
import './index.css';

function App() {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans selection:bg-pink-500 selection:text-white">
      <Background />

      <div className="relative z-10">
        {!accepted ? (
          <ProposalCard onSuccess={() => setAccepted(true)} />
        ) : (
          <SuccessView />
        )}
      </div>
    </div>
  );
}

export default App;
