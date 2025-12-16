
import PredictionForm from './components/PredictionForm';

function App() {
  return (
    <div className="container">
      <header className="text-center py-12 animate-fade-in">
        <h1>Credit Risk Analyzer</h1>
        <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto">
          Advanced machine learning model to predict credit card default probability based on customer demographics and payment history.
        </p>
      </header>

      <main className="pb-20">
        <PredictionForm />
      </main>

      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>© 2025 Credit Risk Analyzer. Powered by Naive Bayes & FastAPI.</p>
      </footer>
    </div>
  );
}

export default App;
