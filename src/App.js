import { useState, useEffect } from 'react';
import './App.scss';
import Following from './components/Following';
import Issues from './components/Issues';
import Seacrh from './components/Search';

function App() {

  // 팔로잉 목록
  const [follow, setFollow] = useState(
    () => JSON.parse(window.localStorage.getItem("follow")) || []
  )

  useEffect(() => {
    // localStorage에 follow 정보 올리기
    window.localStorage.setItem("follow", JSON.stringify(follow));
  }, [follow]);


  return (
    <div className="App">

      <h2>Follow GitHub Repositories!</h2>
      <Seacrh follow={follow} setFollow={setFollow} />
      <Following follow={follow} setFollow={setFollow} />
      <Issues follow={follow} />

    </div>
  );
}

export default App;
