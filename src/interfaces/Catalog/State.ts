export interface State {
    textmask: string;
}

// export interface TextMaskCustomProps {
//     inputRef: (ref: HTMLInputElement | null) => void;
// }

export interface TextMaskCustomProps {
  inputRef: ((ref: HTMLInputElement | null) => void) | React.RefObject<HTMLInputElement> | null;
}