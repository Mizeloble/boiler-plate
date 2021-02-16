import React, { useEffect } from 'react';
import Axios from 'axios';

function LandingPage(props) {
  useEffect(() => {
    Axios.get('/api/hello').then((response) => console.log(response.data));
    return () => {};
  }, []);

  function onClickHandler(event) {
    Axios.get('/api/users/logout').then((response) => {
      if (response.data.success) {
        props.history.push('/login');
      } else {
        alert('로그아웃에 실패하였습니다.');
      }
    });
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <h2>시작페이지</h2>

      <button onClick={onClickHandler}>Logout</button>
    </div>
  );
}

export default LandingPage;
