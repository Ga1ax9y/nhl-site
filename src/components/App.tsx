import AppRouter from '../routes/AppRouter';
import './App.scss'
import Header from './layout/header/Header'

function App() {
  return  (
    <>
      <Header />
      <main className='content'>
        <AppRouter />
      </main>
    </>
  );
}

export default App
