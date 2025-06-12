import MaskedInput from 'react-text-mask';
import { TextMaskCustomProps } from '../../interfaces/Catalog/State';

const TextMaskCustom: React.FC<TextMaskCustomProps> = (props) => {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={(ref: any) => {
                inputRef(ref ? ref.inputElement : null);
            }}
            mask={['(', /[0-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
            placeholderChar={'\u2000'}
        />
    );
}
export default TextMaskCustom;