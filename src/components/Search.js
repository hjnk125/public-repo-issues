import axios from 'axios';
import { useState } from 'react';

function Seacrh(props) {

  const { follow, setFollow } = props;

  // 검색 키워드 
  const [searchOwner, setSearchOwner] = useState('');
  const [searchRepo, setSearchRepo] = useState('');

  // repo명을 검색 후 팔로우
  const searchfollow = () => {
    if (follow.length < 4) {
      axios.get(`https://api.github.com/repos/${searchOwner}/${searchRepo}`)
        .then((res) => {
          // console.log(res.data);
          let newFollows = follow.slice();
          newFollows.push(res.data);
          setFollow(newFollows);
        })
        .catch((error) => {
          alert('존재하지 않는 repositoriy입니다.');
        });
    } else {
      alert('repo 팔로우는 4개까지 가능합니다.')
    }
  };

  return (
    <div className="Search">
      <h3>Search repos</h3>
      <div className="Search-inputs">
        <input placeholder='owner name' onChange={(e) => setSearchOwner(e.target.value)}></input>
        <input placeholder='repo name' onChange={(e) => setSearchRepo(e.target.value)}></input>
        <button onClick={searchfollow}>Follow!</button>
      </div>
    </div>
  )

}

export default Seacrh;