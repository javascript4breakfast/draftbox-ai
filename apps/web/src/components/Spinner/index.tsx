import React from 'react';
import styles from './spinner.module.css';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
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
    <div>
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
    </div>
  );
};

export default Spinner;