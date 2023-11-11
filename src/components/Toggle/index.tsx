import styles from "./Toggle.module.css";

interface IToggle {
  name: string;
  isChecked?: boolean;
  onChange: () => void;
}

const Toggle = ({ name, isChecked, onChange }: IToggle) => {
  return (
    <label className={styles.switch} htmlFor={name}>
      <input
        onChange={onChange}
        type="checkbox"
        name={name}
        id={name}
        checked={isChecked}
      />
      <span className={`${styles.slider} ${styles.round}`}></span>
    </label>
  );
};

export default Toggle;
