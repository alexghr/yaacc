import Image from "next/image";
import { FC, HTMLProps, PropsWithChildren } from "react";
import styles from "./styles.module.css";

type Props = {
  name: string;
  username: string;
  avatarUrl: string;
} & HTMLProps<HTMLDivElement>;

const Suggestion: FC<Props> = ({ name, avatarUrl, ...props }) => {
  return (
    <div className={styles.suggestion} {...props}>
      {avatarUrl && (
        <Image
          className={styles.avatar}
          src={avatarUrl}
          alt={name}
          width={64}
          height={64}
        />
      )}
      <p className={styles.name}>{name}</p>
    </div>
  );
};

export default Suggestion;
