import React from 'react';
import Image from 'react-bootstrap/Image';
import bannerImg from './twoMen.jpeg';
import styles from './Banner.module.css';

const Banner = () => {
  return (
    <Image
      src={bannerImg}
      alt="powderFinder dudes"
      fluid
      className={styles.banner}
    />
  );
};

export default Banner;