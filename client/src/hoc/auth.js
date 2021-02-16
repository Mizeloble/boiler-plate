import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_actions';

export default function authControl(
  SpecificComponent,
  option, //null = 아무나 접근 가능, true = 로그인한 유저만 접근 가능, false = 로그인한 유저는 접근 불가능
  adminRoute = null,
) {
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(auth()).then((response) => {
        //로그인하지 않은 상태
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push('/login');
          }
        } else {
          //로그인한 상태
          if (adminRoute && !response.payload.isAdmin) {
            props.history.push('/');
          } else {
            if (option === false) {
              props.history.push('/');
            }
          }
        }
      });
    }, [dispatch, props.history]);

    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}
