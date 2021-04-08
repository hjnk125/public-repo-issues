import axios from 'axios';
import { useEffect } from 'react';

function Following(props) {

  const { follow, setFollow } = props;

  // x 버튼을 클릭하여 언팔로우
  const unfollow = (e) => {
    let deleteFollow = follow.slice();
    deleteFollow.splice(e.target.id, 1);
    setFollow(deleteFollow);
  }

  // 첫 마운트 시 & 팔로우 목록 없을 시, 해당 레포를 기본으로 팔로우
  useEffect(() => {
    if (follow.length === 0) {
      axios.get(`https://api.github.com/repos/hjnk125/repo-issues`)
        .then((res) => {
          setFollow([res.data]);
        })
    }
  }, [])


  return (
    <div className="Following">
      <h3>Following repos</h3>
      <ul>
        {follow && follow.map((repo, i) => {
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
  )

}

export default Following;