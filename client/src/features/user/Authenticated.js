import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { signinOauth20 } from './UserSlice';
import ReactLoading from "react-loading";
import styles from '../utilities/loading/Loading.module.css';

function Authenticated() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
  useEffect(() => {
    axios.get('http://localhost:5001/api/user', {
      withCredentials: true
  })
      .then(response => {
        const { userName, seasonPass } = response.data;
        dispatch(signinOauth20({ userName, seasonPass }));
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [dispatch]);

  return (
    <div>
      {!isLoggedIn && <ReactLoading
          type="cubes"
          color="rgba(214, 222, 232, 0.985)"
          height="10%"
          width="10%"
          className={styles.loadingContainer}
        />}
    </div>
  );
}

export default Authenticated;