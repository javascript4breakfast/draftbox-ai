import { Activity } from 'react';
import styles from './error-box.module.css';

export default function ErrorBox({ error }: { error: string }) {
    return (
        <Activity mode={error ? 'visible' : 'hidden'}>
            <div className={styles.errorBox}>
                <div>
                    <span className={styles.errorIcon}>❌</span>
                </div>
                <div>
                    <h4>Error: {error}</h4>
                </div>
                <div>
                    <p>
                        Please try again.
                    </p>
                </div>
            </div>
        </Activity>
    );
}