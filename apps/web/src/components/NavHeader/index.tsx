import { ActionButton } from "@adobe/react-spectrum";
import { useTheme } from "../../context/ThemeContext";
import styles from './nav-header.module.css';

export default function NavHeader() {
    const { theme, toggleTheme } = useTheme();
    return (
        <nav className={styles.navHeaderWrapper}>
            <div>
                <h4>Draftbox AI</h4>
            </div>
            <div>
                <ActionButton onPress={toggleTheme}>
                    {theme === 'dark' ? '🌙' : '☀️'}
                </ActionButton>
            </div>
        </nav>
    );
}