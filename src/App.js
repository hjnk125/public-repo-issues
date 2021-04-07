import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.scss';

function App() {

  // 검색 키워드 
  const [searchOwner, setSearchOwner] = useState('');
  const [searchRepo, setSearchRepo] = useState('');
  // 팔로잉 목록
  const [follow, setFollow] = useState(
    () => JSON.parse(window.localStorage.getItem("follow")) || []
  )
  // 팔로우 중인 repo들의 issue 목록
  const [issues, setIssues] = useState([]);
  // 페이지 나누기
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [pages, setPages] = useState([]);

  // repo명을 검색 후 팔로우
  const searchfollow = () => {
    if (follow.length < 4) {
      axios.get(`https://api.github.com/repos/${searchOwner}/${searchRepo}`)
        .then((res) => {
          console.log(res.data);

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

  // x 버튼을 클릭하여 언팔로우
  const unfollow = (e) => {
    let deleteFollow = follow.slice();
    deleteFollow.splice(e.target.id, 1);
    setFollow(deleteFollow);
  }

  useEffect(() => {
    // localStorage의 follow 정보 받아오기
    window.localStorage.setItem("follow", JSON.stringify(follow));
    console.log('follow:', follow);

    // follow 하는 repo가 있을 경우 issue 불러오기
    let issueList = [];
    if (follow.length > 0) {
      follow.map((repo) => {
        return axios.get(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/issues`)
          .then((res) => {
            issueList = issueList.concat(res.data);
            console.log('issueList:', issueList);
            setIssues(issueList);
          });
      });
    }
  }, [follow]);

  // issue 최신순 정렬
  issues.sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  })

  useEffect(() => {
    pagenation();
  }, [issues, postsPerPage]);

  const pagenation = () => {
    let arr = [];
    for (let i = 0; i < Math.ceil(issues.length / postsPerPage); i++) {
      arr.push(i + 1);
    }
    setPages(arr);
  }

  return (
    <div className="App">

      <h2>Follow GitHub Repositories!</h2>

      <div className="Search">
        <h3>Search repos</h3>
        <div className="Search-inputs">
          <input placeholder='owner name' onChange={(e) => setSearchOwner(e.target.value)}></input>
          <input placeholder='repo name' onChange={(e) => setSearchRepo(e.target.value)}></input>
          <button onClick={searchfollow}>Follow!</button>
        </div>
      </div>

      <div className="Following">
        <h3>Following repos</h3>
        <ul>
          {follow.map((repo, i) => {
            return (<li key={i} onClick={() => window.open(`${repo.html_url}`)}>
              <button id={i} onClick={(e) => {
                e.stopPropagation();
                unfollow(e);
              }}>✗</button>
              <span>{repo.full_name} </span>
            </li>)
          })}
        </ul>
      </div>

      <div className="Issues">
        <div className="Issues-title">
          <h3 style={{ display: "inline-block" }}>Issues &nbsp;&nbsp;&nbsp;</h3>
          <label>
            <input type="radio" name="post" id="post5" onClick={() => setPostsPerPage(5)} defaultChecked={true}></input> 5개씩 보기
          </label>
          <label>
            <input type="radio" name="post" id="post10" onClick={() => setPostsPerPage(10)}></input> 10개씩 보기
          </label>
        </div>

        <ul>
          {issues.slice((currentPage - 1) * postsPerPage, (currentPage * postsPerPage)).map((issue, i) => {
            return (<li key={i} onClick={() => window.open(`${issue.html_url}`)}>
              <div className="Issues-title">
                <span>{issue.repository_url.slice(29)}</span> <strong>{issue.title}</strong>
              </div>
              <div className="Issues-info">#{issue.number} opened on {issue.updated_at.slice(0, 10)} by {issue.user.login}</div>
            </li>)
          })}
        </ul>

        <div className="Issue-pages">
          {pages.map((num, i) => {
            return (<li key={i} onClick={() => setCurrentPage(num)}>{num}</li>)
          })}
        </div>
      </div>

    </div>
  );
}

export default App;
