import { useState } from 'react';
import LeasingForm from '../LeasingForm/LeasingForm';
import { sendApplication } from '../utils/api';
import './App.scss';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  function submitLeasingApplicationForm(leasingParams) {
    setIsLoading(true);
    sendApplication(leasingParams)
      .then((res) => console.log(res))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="app">
      <main className="main">
        <LeasingForm isLoading={isLoading} onSubmit={submitLeasingApplicationForm} />
      </main>
    </div>
  );
}

export default App;
