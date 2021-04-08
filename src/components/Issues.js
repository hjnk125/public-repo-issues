import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

function Issues(props) {
  const { follow } = props;

  // 팔로우 중인 repo들의 issue 목록
  const [issues, setIssues] = useState([]);

  // 페이지 나누기
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [pages, setPages] = useState([]);


  useEffect(() => {
    // follow 하는 repo가 있을 경우 issue 불러오기
    let issueList = [];
    if (follow.length > 0) {
      follow.map((repo) => {
        return axios.get(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/issues`)
          .then((res) => {
            issueList = issueList.concat(res.data);
            // console.log('issueList:', issueList);
            setIssues(issueList);
          });
      });
    } else {
      setIssues([]);
    }
  }, [follow]);


  // issue 최신순 정렬
  issues.sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  })

  // 페이지 목록 배열 생성 ex.[1, 2, 3, 4]
  const pagenation = useCallback(() => {
    let arr = [];
    for (let i = 0; i < Math.ceil(issues.length / postsPerPage); i++) {
      arr.push(i + 1);
    }
    setPages(arr);
  }, [issues, postsPerPage]);

  useEffect(() => {
    pagenation();
  }, [pagenation]);

  return (
    <div className="Issues">
      <div className="Issues-title">
        <h3 style={{ display: "inline-block" }}>Issues &nbsp;&nbsp;&nbsp;</h3>
        <label>
          <input type="radio" name="post" id="post5" onClick={() => setPostsPerPage(5)} defaultChecked={true}></input>
            5개씩 보기
          </label>
        <label>
          <input type="radio" name="post" id="post10" onClick={() => setPostsPerPage(10)}></input>
            10개씩 보기
          </label>
      </div>

      <ul>
        {issues.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage).map((issue, i) => {
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
  )

}

export default Issues;