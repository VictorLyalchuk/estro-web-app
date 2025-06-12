export interface State {
    textmask: string;
}

export interface TextMaskCustomProps {
    inputRef: (ref: HTMLInputElement | null) => void;
}