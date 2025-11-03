import React, { Activity } from 'react';
import styles from './spinner.module.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
  loading: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  loading,
  size = 'large',
  color = '#3b82f6',
  text,
}) => {
  const sizeMap = {
    small: 24,
    medium: 48,
    large: 64,
  };

  const spinnerSize = sizeMap[size];

  return (
    <Activity mode={loading ? 'visible' : 'hidden'}>
      <div className={styles.spinnerWrapper}>
        <div
          className={styles.spinner}
          style={{
            width: `${spinnerSize}px`,
            height: `${spinnerSize}px`,
            borderColor: `${color}33`,
            borderTopColor: color,
          }}
        />
        {text && <p className={styles.spinnerText}>{text}</p>}
      </div>
    </Activity>
  );
};

export default Spinner;